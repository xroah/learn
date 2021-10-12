from datetime import datetime
from fastapi import FastAPI, WebSocket
import json
from typing import Any

websocket_app = FastAPI()
users = dict()


def get_current_time():
    now = datetime.now()

    return f'{now:%Y-%m-%d %H:%M:%S}'


def log(msg: str, sign: str=""):
    s = f" {sign}" if sign else ""

    print(f"{get_current_time()}{s}: {msg}")


async def send(websocket: WebSocket, code: int, data: Any):
    res_data = json.dumps({
        "code": code,
        "data": data
    })

    await websocket.send_text(res_data)

    log(res_data, "sent")


async def send_message(websocket: WebSocket, f, to: str, data: Any):
    if not to:
        await send(websocket, -2, "no receiver")
    else:
        target = users.get(to)

        await send(
            target,
            0,
            {
                "from": f,
                "to": to,
                **data
            }
        )


async def close(websocket: WebSocket, code: int = 0):
    await websocket.close(code)
    try:
        username = getattr(websocket, "username")
    except AttributeError:
        pass
    else:
        if username in users:
            del users[username]
    log("Websocket closed")


async def handle_receive(websocket: WebSocket):
    try:
        while True:
            msg = await websocket.receive_text()
            message = json.loads(msg)

            print(f"{get_current_time()} received: {msg}")

            await send_message(
                websocket,
                message.get("from", ""),
                message.get("to", ""),
                message.get("data", {})
            )
    except Exception as e:
        log(f"Error {e}")
    finally:
        await close(websocket)


@websocket_app.websocket("/{username}")
async def start(websocket: WebSocket, username: str):
    print(f"{get_current_time()} connected")

    if not username:
        await send(websocket, -1, "unauthenticated")
    else:
        await websocket.accept()

        websocket.username = username
        users[username] = websocket

    await handle_receive(websocket)
