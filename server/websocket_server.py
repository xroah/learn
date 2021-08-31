import asyncio
import websockets
from datetime import datetime
import json

users = dict()


def get_cookie(websocket, key):
    cookies = websocket.request_headers.get("Cookie", "").split(";")
    ret = dict()

    for cookie in cookies:
        if cookie:
            cookie = cookie.strip()
            item = cookie.split("=")
            ret[item[0]] = item[1]

    return ret.get(key, "")


def get_current_time():
    now = datetime.now()

    return f'{now:%Y-%m-%d %H:%M:%S}'


async def send(websocket, code, data):
    await websocket.send(
        json.dumps({
            "code": code,
            "data": data
        })
    )


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
                "data": data
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
    print(f"{get_current_time()}: Websocket closeed")


async def handle_receive(websocket):
    try:
        while True:
            msg = await websocket.recv()
            message = json.loads(msg)

            await send_message(
                websocket,
                message.get("from", ""),
                message.get("to", ""),
                message.get("data", "")
            )
    except websockets.ConnectionClosedError:
        print("disconnected")
    except Exception as e:
        print("Error:", e)
    finally:
        await close(websocket)


async def _start(websocket, path):
    print(f"{get_current_time()}: connected")

    username = get_cookie(websocket, "username")

    if not username:
        await send(websocket, -1, "unauthenticated")
    else:
        await send(websocket, 0, "hello")

        websocket.username = username
        users[username] = websocket

    await handle_receive(websocket)


def start_server(host="localhost"):
    server = websockets.serve(_start, host, 8888)

    asyncio.get_event_loop().run_until_complete(server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    start_server()
