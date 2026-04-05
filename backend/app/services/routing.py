import math
import logging
from typing import List, Dict, Tuple
from itertools import permutations

logger = logging.getLogger(__name__)


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two coordinates in kilometers
    using Haversine formula
    """
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c


def calculate_route_distance(waypoints: List[Dict]) -> float:
    """Calculate total distance of a route"""
    total_distance = 0.0
    
    for i in range(len(waypoints) - 1):
        distance = haversine_distance(
            waypoints[i]["latitude"],
            waypoints[i]["longitude"],
            waypoints[i+1]["latitude"],
            waypoints[i+1]["longitude"],
        )
        total_distance += distance
    
    return total_distance


def optimize_route(
    waypoints: List[Dict],
    start_lat: float = None,
    start_lon: float = None,
) -> Tuple[List[Dict], float]:
    """
    Optimize route using nearest neighbor algorithm
    
    For production, consider using actual routing APIs (Google Maps, OSRM)
    
    Returns:
        - Optimized waypoints list
        - Total distance in km
    """
    
    if not waypoints:
        return [], 0.0
    
    if len(waypoints) <= 2:
        return waypoints, calculate_route_distance(waypoints)
    
    # Start from depot or first waypoint
    if start_lat is not None and start_lon is not None:
        current = {"latitude": start_lat, "longitude": start_lon, "bin_id": "START"}
    else:
        current = waypoints[0]
    
    remaining = [w for w in waypoints if w != current]
    optimized = [current]
    
    # Nearest neighbor greedy algorithm
    while remaining:
        nearest = min(
            remaining,
            key=lambda w: haversine_distance(
                current["latitude"],
                current["longitude"],
                w["latitude"],
                w["longitude"],
            )
        )
        
        optimized.append(nearest)
        remaining.remove(nearest)
        current = nearest
    
    total_distance = calculate_route_distance(optimized)
    
    logger.info(f"Route optimized: {len(optimized)} waypoints, {total_distance:.2f} km")
    
    return optimized, total_distance


def estimate_time(distance_km: float, avg_speed_kmh: float = 30) -> float:
    """
    Estimate travel time in minutes
    
    Includes stops for collection (5 min per stop)
    """
    travel_time = (distance_km / avg_speed_kmh) * 60  # minutes
    collection_time = len([1]) * 5  # Simplified
    
    return travel_time + collection_time
