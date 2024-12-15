from sqlalchemy import Column, Integer, String
from app.database import Base


class ImagePair(Base):
    __tablename__ = "image_pairs"

    id = Column(Integer, primary_key=True, index=True)
    original_path = Column(String, nullable=False)
    mask_path = Column(String, nullable=False)
