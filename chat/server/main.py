from fastapi import FastAPI
from websocket import websocket_app
from api import api_app
import uvicorn


app = FastAPI()
app.mount("/websocket", websocket_app)
app.mount("/api", api_app)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5678)