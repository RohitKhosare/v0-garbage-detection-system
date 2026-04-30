-- Add mobile cameras table to existing CleanCity AI database
-- Run this script after the main init-db.sql

-- Mobile cameras table (for phones/handheld devices)
CREATE TABLE IF NOT EXISTS mobile_cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) UNIQUE NOT NULL,
  device_name VARCHAR(255),
  user_id UUID REFERENCES users(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'offline')),
  detection_count INT DEFAULT 0,
  last_detection_at TIMESTAMP WITH TIME ZONE,
  last_location_update TIMESTAMP WITH TIME ZONE,
  battery_level INT,
  signal_strength INT,
  app_version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mobile camera sessions (for tracking app usage)
CREATE TABLE IF NOT EXISTS mobile_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_camera_id UUID NOT NULL REFERENCES mobile_cameras(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  location_count INT DEFAULT 0,
  detection_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mobile_cameras_device_id ON mobile_cameras(device_id);
CREATE INDEX IF NOT EXISTS idx_mobile_cameras_user_id ON mobile_cameras(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_cameras_status ON mobile_cameras(status);
CREATE INDEX IF NOT EXISTS idx_mobile_cameras_location ON mobile_cameras(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_mobile_cameras_detection_count ON mobile_cameras(detection_count);
CREATE INDEX IF NOT EXISTS idx_mobile_sessions_mobile_camera_id ON mobile_sessions(mobile_camera_id);
CREATE INDEX IF NOT EXISTS idx_mobile_sessions_user_id ON mobile_sessions(user_id);

-- Update detections table to support mobile camera tracking
ALTER TABLE detections ADD COLUMN IF NOT EXISTS mobile_camera_id UUID REFERENCES mobile_cameras(id);
ALTER TABLE detections ADD COLUMN IF NOT EXISTS device_type VARCHAR(50) DEFAULT 'cctv'; -- 'cctv', 'mobile', 'iot'
ALTER TABLE detections ADD COLUMN IF NOT EXISTS location_name VARCHAR(255);
ALTER TABLE detections ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create index for device type
CREATE INDEX IF NOT EXISTS idx_detections_device_type ON detections(device_type);
CREATE INDEX IF NOT EXISTS idx_detections_mobile_camera_id ON detections(mobile_camera_id);
