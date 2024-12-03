from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from modules.tts import srt_edge_tts
import os

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


class Ping(BaseModel):
    text: str = Field(..., description="File path to the audio file")


@app.get("/ping")

async def ping():
    logger.warning("ping")
    voice_models = {
          "SPEAKER_00": "km-KH-PisethNeural",
          "SPEAKER_01": "km-KH-SreymomNeural",
        }
    rvc_models = {
          "SPEAKER_00": "me",
          "SPEAKER_01": "rosev3",
        }
    try:
        result = await srt_edge_tts(path="data/test1.srt", voice="km-KH-PisethNeural", voice_models=voice_models, rvc_models=rvc_models)
        return {"text": result}
    except Exception as e:
        logger.error(f"Error generating audio: {e}")
        return {"text": "Error generating audio"}


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request, id: str = 8901):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"id": id}
    )


if __name__ == "__main__":
    port = 8901
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
