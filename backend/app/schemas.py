from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import UserRole


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.CITIZEN


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Detection Schemas
class DetectionCreate(BaseModel):
    latitude: float
    longitude: float
    garbage_type: Optional[str] = None
    severity: Optional[str] = None
    notes: Optional[str] = None


class DetectionResponse(BaseModel):
    id: int
    user_id: int
    original_image_url: str
    detected_image_url: str
    latitude: float
    longitude: float
    confidence: float
    garbage_type: Optional[str]
    severity: Optional[str]
    status: str
    detections_data: dict
    created_at: datetime
    
    class Config:
        from_attributes = True


class DetectionFilterParams(BaseModel):
    skip: int = 0
    limit: int = 100
    status: Optional[str] = None
    severity: Optional[str] = None
    days: int = 30


# Bin Schemas
class BinUpdateCreate(BaseModel):
    bin_id: str
    fill_level: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    battery_level: Optional[float] = None


class GarbageBinResponse(BaseModel):
    id: int
    bin_id: str
    latitude: float
    longitude: float
    capacity: float
    current_fill: float
    status: str
    location_name: str
    last_emptied: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Heatmap Schemas
class HeatmapPoint(BaseModel):
    latitude: float
    longitude: float
    count: int
    severity: str


class HeatmapResponse(BaseModel):
    points: List[HeatmapPoint]
    total_detections: int


# Route Schemas
class Waypoint(BaseModel):
    latitude: float
    longitude: float
    bin_id: str
    order: int


class RouteOptimization(BaseModel):
    waypoints: List[Waypoint]
    total_distance: float
    estimated_time: float


class HealthResponse(BaseModel):
    status: str
    database: str
    version: str
