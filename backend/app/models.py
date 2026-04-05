from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    OFFICER = "officer"
    DRIVER = "driver"
    CITIZEN = "citizen"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    detections = relationship("Detection", back_populates="user")
    bins = relationship("GarbageBin", back_populates="assigned_to")


class GarbageBin(Base):
    __tablename__ = "garbage_bins"
    
    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(String, unique=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    capacity = Column(Float, default=100.0)  # in liters
    current_fill = Column(Float, default=0.0)
    status = Column(String, default="empty")  # empty, partial, full, needs_maintenance
    location_name = Column(String)
    assigned_to = relationship("User", back_populates="bins")
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    last_emptied = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    updates = relationship("BinUpdate", back_populates="bin")


class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_image_url = Column(String)
    detected_image_url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    detections_data = Column(JSON)  # {boxes: [], confidences: [], classes: []}
    confidence = Column(Float)
    garbage_type = Column(String)
    severity = Column(String)  # low, medium, high
    status = Column(String, default="reported")  # reported, assigned, completed, rejected
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="detections")


class BinUpdate(Base):
    __tablename__ = "bin_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    bin_id = Column(Integer, ForeignKey("garbage_bins.id"))
    fill_level = Column(Float)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    battery_level = Column(Float, nullable=True)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    bin = relationship("GarbageBin", back_populates="updates")


class Route(Base):
    __tablename__ = "routes"
    
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    waypoints = Column(JSON)  # [{lat, lng, bin_id}]
    total_distance = Column(Float)
    estimated_time = Column(Float)  # in minutes
    status = Column(String, default="pending")  # pending, in_progress, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
