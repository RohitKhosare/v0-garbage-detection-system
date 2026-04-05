import logging
import numpy as np
from ultralytics import YOLO
from PIL import Image
import io
from typing import Tuple, List, Dict
from app.config import settings

logger = logging.getLogger(__name__)


class YOLODetectionService:
    """YOLOv8 object detection service"""
    
    def __init__(self):
        """Initialize YOLO model"""
        try:
            self.model = YOLO(settings.YOLO_MODEL)
            logger.info(f"YOLO model loaded: {settings.YOLO_MODEL}")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {str(e)}")
            raise
    
    def detect_garbage(
        self,
        image_data: bytes,
        confidence_threshold: float = None
    ) -> Tuple[Image.Image, Dict, List[Dict]]:
        """
        Detect garbage in image
        
        Returns:
            - Annotated image (PIL Image)
            - Detection summary dict
            - List of detections with boxes and confidences
        """
        
        if confidence_threshold is None:
            confidence_threshold = settings.YOLO_CONFIDENCE_THRESHOLD
        
        try:
            # Load image from bytes
            image = Image.open(io.BytesIO(image_data))
            
            # Run inference
            results = self.model(image, conf=confidence_threshold)
            
            if not results or len(results) == 0:
                return image, {"found": False, "count": 0}, []
            
            result = results[0]
            
            # Extract detections
            detections = []
            boxes = result.boxes
            
            for i, box in enumerate(boxes):
                detection = {
                    "class_id": int(box.cls),
                    "class_name": result.names[int(box.cls)],
                    "confidence": float(box.conf),
                    "bbox": {
                        "x1": float(box.xyxy[0][0]),
                        "y1": float(box.xyxy[0][1]),
                        "x2": float(box.xyxy[0][2]),
                        "y2": float(box.xyxy[0][3]),
                    }
                }
                detections.append(detection)
            
            # Create annotated image
            annotated_image = Image.fromarray(result.plot()[:, :, ::-1])
            
            # Summary
            summary = {
                "found": True,
                "count": len(detections),
                "classes": list(set(d["class_name"] for d in detections)),
                "avg_confidence": float(np.mean([d["confidence"] for d in detections])),
            }
            
            return annotated_image, summary, detections
            
        except Exception as e:
            logger.error(f"Detection failed: {str(e)}")
            raise


# Global instance
_yolo_service = None


def get_yolo_service():
    """Get or create YOLO service instance"""
    global _yolo_service
    if _yolo_service is None:
        _yolo_service = YOLODetectionService()
    return _yolo_service
