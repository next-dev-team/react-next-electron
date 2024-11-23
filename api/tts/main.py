

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from modules.tts import tts_engine


app =  FastAPI(swagger_ui_parameters={})

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

@app.get("/")
def read_root():
 return {"Hello": "World"}


if __name__ == "__main__":
    port = 8901
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
