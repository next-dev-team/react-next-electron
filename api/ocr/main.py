from typing import Optional
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import httpx
from pydantic import BaseModel, Field
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import os

import easyocr
import numpy as np
from PIL import Image
from io import BytesIO

from fastapi.templating import Jinja2Templates


app = FastAPI(swagger_ui_parameters={})

static_dir = "static"
if not os.path.isdir(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

templates = Jinja2Templates(directory="templates", autoescape=False, auto_reload=True)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body model
class OCRRequest(BaseModel):
    lang: Optional[list[str]] = ["en"]

@app.post("/ocr")
async def perform_ocr():
    url = "https://i.imgur.com/mLjiHxL.jpeg"

    lang = ['en']

    # Perform OCR
    reader = easyocr.Reader(lang)
    results = reader.readtext(url)

    # Format results
    extracted_text = []
    for detection in results:
        text_entry = {
            "text": detection[1],
            "confidence": float(detection[2]),
            "bbox": detection[0]
        }
        extracted_text.append(text_entry)

    return {
        "status": "success",
        "results": extracted_text,
        "languages": lang
    }



class Ping(BaseModel):
    text: str = Field(..., description="File path to the audio file")

@app.get("/ping")

async def ping():
        return {"text": "Error generating audio"}


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request, id: str = 8902):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"id": id}
    )

if __name__ == "__main__":
    port = 8902
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
