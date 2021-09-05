import asyncio
import websockets
from datetime import datetime
import json

users = dict()


def get_current_time():
    now = datetime.now()

    return f'{now:%Y-%m-%d %H:%M:%S}'


def log(msg, sign=""):
    s = f" {sign}" if sign else ""

    print(f"{get_current_time()}{s}: {msg}")


async def send(websocket, code, data):
    res_data = json.dumps({
        "code": code,
        "data": data
    })

    await websocket.send(res_data)

    log(res_data, "sent")


async def send_message(websocket, f, to, data):
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


async def close(websocket):
    await websocket.close()
    try:
        username = getattr(websocket, "username")
    except AttributeError:
        pass
    else:
        if username in users:
            del users[username]
    log("Websocket closed")


async def handle_receive(websocket):
    try:
        while True:
            msg = await websocket.recv()
            message = json.loads(msg)

            print(f"{get_current_time()} received: {msg}")

            await send_message(
                websocket,
                message.get("from", ""),
                message.get("to", ""),
                message.get("data", {})
            )
    except websockets.ConnectionClosedError:
        log("disconnected")
    except Exception as e:
        log(f"Error {e}")
    finally:
        await close(websocket)


async def _start(websocket, path):
    username = path.replace("/", "")
    print(f"{get_current_time()} connected")

    if not username:
        await send(websocket, -1, "unauthenticated")
    else:
        await send(websocket, 0, "hello")

        websocket.username = username
        users[username] = websocket

    await handle_receive(websocket)


def start_server(host="localhost"):
    server = websockets.serve(_start, host, 5678)

    asyncio.get_event_loop().run_until_complete(server)
    asyncio.get_event_loop().run_forever()

    log("server started")


if __name__ == "__main__":
    start_server("0.0.0.0")
