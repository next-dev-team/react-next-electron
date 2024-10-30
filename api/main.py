from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def ping(p="top 20 world place"):
    result = p
    return {"status": "OK", "result": result}


if __name__ == "__main__":
    port = 8100
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
