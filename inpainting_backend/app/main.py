from fastapi import FastAPI, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
from app import models, schemas, crud, database

import shutil
from pathlib import Path

app = FastAPI()
database.Base.metadata.create_all(bind=database.engine)

ORIGINAL_DIR = Path("./app/static/original_images")
MASK_DIR = Path("./app/static/mask_images")

ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
MASK_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Inpainting Widget Portal API"}


@app.post("/upload/")
async def upload_images(
    original: UploadFile, mask: UploadFile, db: Session = Depends(database.get_db)
):
    original_path = ORIGINAL_DIR / original.filename
    mask_path = MASK_DIR / mask.filename

    try:
        with open(original_path, "wb") as buffer:
            shutil.copyfileobj(original.file, buffer)

        with open(mask_path, "wb") as buffer:
            shutil.copyfileobj(mask.file, buffer)

        image_pair = crud.create_image_pair(
            db,
            schemas.ImagePairCreate(
                original_path=str(original_path), mask_path=str(mask_path)
            ),
        )
        return {"id": image_pair.id, "message": "Images uploaded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading images: {e}")


@app.get("/images/{image_id}")
def get_image_pair(image_id: int, db: Session = Depends(database.get_db)):
    image_pair = crud.get_image_pair(db, image_id)
    if not image_pair:
        raise HTTPException(status_code=404, detail="Image pair not found.")
    return image_pair
