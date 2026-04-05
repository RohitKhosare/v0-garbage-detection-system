from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.database import get_db
from app.models import GarbageBin, BinUpdate, User, UserRole
from app.schemas import BinUpdateCreate, GarbageBinResponse
from app.security import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


def update_bin_status(fill_level: float) -> str:
    """Determine bin status based on fill level"""
    if fill_level >= 90:
        return "full"
    elif fill_level >= 50:
        return "partial"
    else:
        return "empty"


@router.get("/bins", response_model=dict)
async def get_bins(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    status_filter: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all garbage bins"""
    
    try:
        query = db.query(GarbageBin)
        
        if status_filter:
            query = query.filter(GarbageBin.status == status_filter)
        
        total = query.count()
        
        bins = query.order_by(GarbageBin.updated_at.desc()).offset(skip).limit(limit).all()
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": [GarbageBinResponse.model_validate(b) for b in bins]
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch bins: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch bins"
        )


@router.get("/bins/{bin_id}", response_model=GarbageBinResponse)
async def get_bin(
    bin_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get single bin details"""
    
    bin_obj = db.query(GarbageBin).filter(GarbageBin.id == bin_id).first()
    
    if not bin_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bin not found"
        )
    
    return GarbageBinResponse.model_validate(bin_obj)


@router.post("/bin-update")
async def update_bin_fill_level(
    update_data: BinUpdateCreate,
    db: Session = Depends(get_db),
):
    """IoT endpoint to update bin fill level"""
    
    try:
        # Find bin by bin_id
        bin_obj = db.query(GarbageBin).filter(
            GarbageBin.bin_id == update_data.bin_id
        ).first()
        
        if not bin_obj:
            # Create new bin if doesn't exist
            bin_obj = GarbageBin(
                bin_id=update_data.bin_id,
                latitude=0.0,
                longitude=0.0,
                location_name=f"Bin {update_data.bin_id}",
                current_fill=update_data.fill_level,
                status=update_bin_status(update_data.fill_level),
            )
            db.add(bin_obj)
        else:
            # Update existing bin
            bin_obj.current_fill = update_data.fill_level
            bin_obj.status = update_bin_status(update_data.fill_level)
            bin_obj.updated_at = datetime.utcnow()
        
        # Save update record
        bin_update = BinUpdate(
            bin_id=bin_obj.id,
            fill_level=update_data.fill_level,
            temperature=update_data.temperature,
            humidity=update_data.humidity,
            battery_level=update_data.battery_level,
            status=bin_obj.status,
        )
        
        db.add(bin_update)
        db.commit()
        db.refresh(bin_obj)
        
        logger.info(f"Bin {update_data.bin_id} updated: fill_level={update_data.fill_level}%")
        
        return {
            "message": "Bin updated successfully",
            "bin_id": bin_obj.id,
            "status": bin_obj.status,
        }
        
    except Exception as e:
        logger.error(f"Failed to update bin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update bin"
        )


@router.get("/bins/{bin_id}/history")
async def get_bin_history(
    bin_id: int,
    limit: int = Query(100, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get bin fill level history"""
    
    bin_obj = db.query(GarbageBin).filter(GarbageBin.id == bin_id).first()
    
    if not bin_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bin not found"
        )
    
    history = db.query(BinUpdate).filter(
        BinUpdate.bin_id == bin_id
    ).order_by(BinUpdate.created_at.desc()).limit(limit).all()
    
    return {
        "bin_id": bin_id,
        "updates": [
            {
                "timestamp": h.created_at,
                "fill_level": h.fill_level,
                "temperature": h.temperature,
                "humidity": h.humidity,
                "battery_level": h.battery_level,
                "status": h.status,
            }
            for h in history
        ]
    }
