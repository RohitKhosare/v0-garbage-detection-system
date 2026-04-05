from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.database import get_db
from app.models import GarbageBin, Route, User, UserRole
from app.schemas import RouteOptimization, Waypoint
from app.security import get_current_user, require_role
from app.services.routing import optimize_route, haversine_distance

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/optimize-route", response_model=dict)
async def optimize_collection_route(
    bin_ids: list = Query(...),
    start_latitude: float = Query(None),
    start_longitude: float = Query(None),
    current_user: User = Depends(require_role(["officer", "admin", "driver"])),
    db: Session = Depends(get_db),
):
    """
    Optimize garbage collection route
    
    Takes list of bin IDs and returns optimized route with distance and time estimates
    """
    
    try:
        # Fetch bins
        bins = db.query(GarbageBin).filter(GarbageBin.id.in_(bin_ids)).all()
        
        if not bins:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No bins found"
            )
        
        # Convert to waypoints
        waypoints = [
            {
                "latitude": bin_obj.latitude,
                "longitude": bin_obj.longitude,
                "bin_id": bin_obj.bin_id,
            }
            for bin_obj in bins
        ]
        
        # Optimize route
        optimized, total_distance = optimize_route(
            waypoints,
            start_lat=start_latitude,
            start_lon=start_longitude,
        )
        
        # Estimate time (30 km/h average + 5 min per stop)
        estimated_time = (total_distance / 30) * 60 + (len(optimized) * 5)
        
        logger.info(f"Route optimized for {len(optimized)} stops: {total_distance:.2f} km")
        
        return {
            "optimized_waypoints": [
                {
                    "order": i,
                    "latitude": w["latitude"],
                    "longitude": w["longitude"],
                    "bin_id": w.get("bin_id"),
                }
                for i, w in enumerate(optimized)
            ],
            "total_distance_km": round(total_distance, 2),
            "estimated_time_minutes": round(estimated_time, 0),
            "stop_count": len(optimized),
        }
        
    except Exception as e:
        logger.error(f"Route optimization failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Route optimization failed: {str(e)}"
        )


@router.post("/routes")
async def create_route(
    waypoint_ids: list = Query(...),
    current_user: User = Depends(require_role(["officer", "admin"])),
    db: Session = Depends(get_db),
):
    """Create and assign collection route"""
    
    try:
        # Fetch bins
        bins = db.query(GarbageBin).filter(GarbageBin.id.in_(waypoint_ids)).all()
        
        # Optimize
        waypoints = [
            {
                "latitude": b.latitude,
                "longitude": b.longitude,
                "bin_id": b.bin_id,
            }
            for b in bins
        ]
        
        optimized, total_distance = optimize_route(waypoints)
        estimated_time = (total_distance / 30) * 60 + (len(optimized) * 5)
        
        # Save route
        route = Route(
            driver_id=None,  # To be assigned later
            waypoints=optimized,
            total_distance=total_distance,
            estimated_time=estimated_time,
            status="pending",
        )
        
        db.add(route)
        db.commit()
        db.refresh(route)
        
        logger.info(f"Route created: {route.id}")
        
        return {
            "route_id": route.id,
            "status": route.status,
            "total_distance_km": round(total_distance, 2),
            "estimated_time_minutes": round(estimated_time, 0),
            "waypoints": len(optimized),
        }
        
    except Exception as e:
        logger.error(f"Failed to create route: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create route"
        )


@router.get("/routes/{route_id}")
async def get_route(
    route_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get route details"""
    
    route = db.query(Route).filter(Route.id == route_id).first()
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    # Check authorization
    if current_user.role == UserRole.DRIVER and route.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return {
        "id": route.id,
        "waypoints": route.waypoints,
        "total_distance_km": route.total_distance,
        "estimated_time_minutes": route.estimated_time,
        "status": route.status,
        "created_at": route.created_at,
    }


@router.patch("/routes/{route_id}/assign/{driver_id}")
async def assign_route(
    route_id: int,
    driver_id: int,
    current_user: User = Depends(require_role(["officer", "admin"])),
    db: Session = Depends(get_db),
):
    """Assign route to driver"""
    
    route = db.query(Route).filter(Route.id == route_id).first()
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    driver = db.query(User).filter(User.id == driver_id).first()
    
    if not driver or driver.role != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    
    route.driver_id = driver_id
    route.status = "assigned"
    db.commit()
    
    logger.info(f"Route {route_id} assigned to driver {driver_id}")
    
    return {"message": "Route assigned successfully"}


@router.patch("/routes/{route_id}/status")
async def update_route_status(
    route_id: int,
    status: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update route status"""
    
    route = db.query(Route).filter(Route.id == route_id).first()
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    # Drivers can only update their own routes
    if current_user.role == UserRole.DRIVER and route.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    route.status = status
    db.commit()
    
    return {"message": "Route status updated"}


# Import UserRole for type checking
from app.models import UserRole
