from pydantic import BaseModel


class ImagePairBase(BaseModel):
    original_path: str
    mask_path: str


class ImagePairCreate(ImagePairBase):
    pass


class ImagePair(ImagePairBase):
    id: int

    class Config:
        from_attributes = True
