from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.models import Detection, User
from app.schemas import DetectionResponse, DetectionFilterParams
from app.security import get_current_user
from app.services.yolo import get_yolo_service
from app.services.s3 import get_s3_service

logger = logging.getLogger(__name__)
router = APIRouter()


def determine_severity(confidence: float) -> str:
    """Determine severity level based on confidence"""
    if confidence >= 0.8:
        return "high"
    elif confidence >= 0.6:
        return "medium"
    else:
        return "low"


@router.post("/detect", response_model=DetectionResponse)
async def detect_garbage(
    file: UploadFile = File(...),
    latitude: float = Query(...),
    longitude: float = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload image and detect garbage
    
    Returns detection results with annotated image URL
    """
    
    try:
        # Read uploaded file
        contents = await file.read()
        
        # Initialize services
        yolo_service = get_yolo_service()
        s3_service = get_s3_service()
        
        # Run detection
        annotated_image, summary, detections = yolo_service.detect_garbage(contents)
        
        # Upload original image to S3
        original_url = s3_service.upload_bytes(
            contents,
            folder="detections/original",
            filename=f"detection_{datetime.utcnow().isoformat()}.jpg"
        )
        
        # Upload annotated image to S3
        detected_url = s3_service.upload_image(
            annotated_image,
            folder="detections/annotated",
            filename=f"detection_{datetime.utcnow().isoformat()}.jpg"
        )
        
        # Determine garbage type and severity
        garbage_type = ", ".join(summary["classes"]) if summary["classes"] else "unknown"
        confidence = summary["avg_confidence"]
        severity = determine_severity(confidence)
        
        # Save detection to database
        detection = Detection(
            user_id=current_user.id,
            original_image_url=original_url,
            detected_image_url=detected_url,
            latitude=latitude,
            longitude=longitude,
            detections_data={
                "detections": detections,
                "summary": summary,
            },
            confidence=confidence,
            garbage_type=garbage_type,
            severity=severity,
            status="reported",
        )
        
        db.add(detection)
        db.commit()
        db.refresh(detection)
        
        logger.info(f"Detection recorded: {detection.id} by user {current_user.id}")
        
        return DetectionResponse.model_validate(detection)
        
    except Exception as e:
        logger.error(f"Detection failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Detection failed: {str(e)}"
        )


@router.get("/detections", response_model=dict)
async def get_detections(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    status_filter: str = Query(None),
    severity: str = Query(None),
    days: int = Query(30),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detection history"""
    
    try:
        # Build query
        query = db.query(Detection)
        
        # Filter by date
        since = datetime.utcnow() - timedelta(days=days)
        query = query.filter(Detection.created_at >= since)
        
        # Filter by user (citizens see only their own)
        if current_user.role.value == "citizen":
            query = query.filter(Detection.user_id == current_user.id)
        
        # Apply filters
        if status_filter:
            query = query.filter(Detection.status == status_filter)
        
        if severity:
            query = query.filter(Detection.severity == severity)
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        detections = query.order_by(Detection.created_at.desc()).offset(skip).limit(limit).all()
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": [DetectionResponse.model_validate(d) for d in detections]
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch detections: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch detections"
        )


@router.get("/detections/{detection_id}", response_model=DetectionResponse)
async def get_detection(
    detection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get single detection details"""
    
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detection not found"
        )
    
    # Check authorization (citizens can only see their own)
    if current_user.role.value == "citizen" and detection.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this detection"
        )
    
    return DetectionResponse.model_validate(detection)


@router.patch("/detections/{detection_id}")
async def update_detection(
    detection_id: int,
    status: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update detection status"""
    
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detection not found"
        )
    
    # Only officers and admins can update
    if current_user.role.value not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update detections"
        )
    
    detection.status = status
    db.commit()
    db.refresh(detection)
    
    return DetectionResponse.model_validate(detection)
