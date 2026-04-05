import boto3
import logging
import io
from datetime import datetime
from PIL import Image
from app.config import settings

logger = logging.getLogger(__name__)


class S3Service:
    """AWS S3 file storage service"""
    
    def __init__(self):
        """Initialize S3 client"""
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )
            self.bucket_name = settings.S3_BUCKET_NAME
            logger.info(f"S3 client initialized for bucket: {self.bucket_name}")
        except Exception as e:
            logger.error(f"Failed to initialize S3 client: {str(e)}")
            raise
    
    def upload_image(
        self,
        image: Image.Image,
        folder: str,
        filename: str = None
    ) -> str:
        """
        Upload image to S3
        
        Returns:
            - S3 object URL
        """
        
        try:
            if filename is None:
                filename = f"{datetime.utcnow().isoformat()}.jpg"
            
            # Convert PIL image to bytes
            img_io = io.BytesIO()
            image.save(img_io, format='JPEG', quality=85)
            img_io.seek(0)
            
            # Upload to S3
            key = f"{settings.S3_IMAGE_PREFIX}{folder}/{filename}"
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=img_io.getvalue(),
                ContentType='image/jpeg',
                ACL='public-read',
            )
            
            # Generate URL
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            
            logger.info(f"Image uploaded to S3: {url}")
            return url
            
        except Exception as e:
            logger.error(f"S3 upload failed: {str(e)}")
            raise
    
    def upload_bytes(
        self,
        data: bytes,
        folder: str,
        filename: str,
        content_type: str = "image/jpeg"
    ) -> str:
        """Upload raw bytes to S3"""
        
        try:
            key = f"{settings.S3_IMAGE_PREFIX}{folder}/{filename}"
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=data,
                ContentType=content_type,
                ACL='public-read',
            )
            
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            logger.info(f"File uploaded to S3: {url}")
            return url
            
        except Exception as e:
            logger.error(f"S3 upload failed: {str(e)}")
            raise


# Global instance
_s3_service = None


def get_s3_service():
    """Get or create S3 service instance"""
    global _s3_service
    if _s3_service is None:
        _s3_service = S3Service()
    return _s3_service
