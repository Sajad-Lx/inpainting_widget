from sqlalchemy.orm import Session
from app import models, schemas


def create_image_pair(db: Session, image_pair: schemas.ImagePairCreate):
    db_image_pair = models.ImagePair(
        original_path=image_pair.original_path, mask_path=image_pair.mask_path
    )
    db.add(db_image_pair)
    db.commit()
    db.refresh(db_image_pair)
    return db_image_pair


def get_image_pair(db: Session, image_id: int):
    return db.query(models.ImagePair).filter(models.ImagePair.id == image_id).first()
