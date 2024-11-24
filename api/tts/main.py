from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from modules.tts import tts_engine

from fastapi.templating import Jinja2Templates


app = FastAPI(swagger_ui_parameters={})
app.mount("/static", StaticFiles(directory="static"), name="static")

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
def ping():
    logger.warning("ping")

    try:
        result = tts_engine()
        return {"text": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request, id: str = 8901):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"id": id}
    )


if __name__ == "__main__":
    port = 8901
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
