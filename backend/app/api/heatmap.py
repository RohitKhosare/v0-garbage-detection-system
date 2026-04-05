from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.models import Detection, User
from app.schemas import HeatmapResponse, HeatmapPoint
from app.security import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/heatmap", response_model=HeatmapResponse)
async def get_heatmap(
    days: int = Query(30, ge=1, le=365),
    grid_size: int = Query(10, ge=5, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get heatmap of garbage detection hotspots
    
    Groups detections by geographic grid and returns count + severity
    """
    
    try:
        # Filter detections by date
        since = datetime.utcnow() - timedelta(days=days)
        detections = db.query(Detection).filter(
            Detection.created_at >= since
        ).all()
        
        if not detections:
            return HeatmapResponse(points=[], total_detections=0)
        
        # Group by geographic grid
        # Simplified: group by rounded lat/long
        grid_map = {}
        
        for detection in detections:
            # Round coordinates to grid
            lat_grid = round(detection.latitude * grid_size) / grid_size
            lng_grid = round(detection.longitude * grid_size) / grid_size
            
            key = f"{lat_grid},{lng_grid}"
            
            if key not in grid_map:
                grid_map[key] = {
                    "latitude": lat_grid,
                    "longitude": lng_grid,
                    "count": 0,
                    "severities": [],
                }
            
            grid_map[key]["count"] += 1
            grid_map[key]["severities"].append(detection.severity)
        
        # Convert to heatmap points
        points = []
        for key, data in grid_map.items():
            # Determine dominant severity
            severities = data["severities"]
            if "high" in severities:
                severity = "high"
            elif "medium" in severities:
                severity = "medium"
            else:
                severity = "low"
            
            point = HeatmapPoint(
                latitude=data["latitude"],
                longitude=data["longitude"],
                count=data["count"],
                severity=severity,
            )
            points.append(point)
        
        # Sort by count descending
        points.sort(key=lambda p: p.count, reverse=True)
        
        logger.info(f"Heatmap generated: {len(points)} grid points")
        
        return HeatmapResponse(
            points=points,
            total_detections=len(detections),
        )
        
    except Exception as e:
        logger.error(f"Failed to generate heatmap: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate heatmap"
        )


@router.get("/heatmap/radius")
async def get_hotspots_by_radius(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius_km: float = Query(5, ge=0.1, le=100),
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get detections within radius of coordinates
    
    Useful for route optimization around specific areas
    """
    
    try:
        # Simple lat/long distance calculation (approximately 1 degree = 111 km)
        lat_delta = radius_km / 111.0
        lng_delta = radius_km / (111.0 * 1)  # Simplified
        
        since = datetime.utcnow() - timedelta(days=days)
        
        detections = db.query(Detection).filter(
            Detection.created_at >= since,
            Detection.latitude.between(latitude - lat_delta, latitude + lat_delta),
            Detection.longitude.between(longitude - lng_delta, longitude + lng_delta),
        ).all()
        
        # Calculate severity stats
        severity_counts = {"high": 0, "medium": 0, "low": 0}
        for d in detections:
            if d.severity:
                severity_counts[d.severity] += 1
        
        return {
            "center": {
                "latitude": latitude,
                "longitude": longitude,
            },
            "radius_km": radius_km,
            "total_detections": len(detections),
            "severity": severity_counts,
            "detections": [
                {
                    "id": d.id,
                    "latitude": d.latitude,
                    "longitude": d.longitude,
                    "severity": d.severity,
                    "created_at": d.created_at,
                }
                for d in detections
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to get hotspots: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get hotspots"
        )
