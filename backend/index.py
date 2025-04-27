from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Настройки CORS (должны совпадать с вашим фронтендом)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://192.168.0.101:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-photo/")
async def upload_photo(image: UploadFile = File(...)):
    try:
        # Сохраняем файл
        contents = await image.read()
        with open(f"uploads/{image.filename}", "wb") as f:
            f.write(contents)
        
        # Здесь можно добавить обработку изображения
        return {
            "status": "success",
            "filename": image.filename,
            "size": len(contents)
        }
    except Exception as e:
        return {
            "status": "error",
            "detail": str(e)
        }