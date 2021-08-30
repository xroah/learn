import asyncio
import websockets
import time
import json

users = set()


def get_cookie(websocket, key):
    cookies = websocket.request_headers.get("Cookie", "").split(";")
    ret = dict()

    for cookie in cookies:
        if cookie:
            cookie = cookie.strip()
            item = cookie.split("=")
            ret[item[0]] = item[1]

    return ret.get(key, "")


async def _start(websocket, path):
    mark = "*" * 20

    await websocket.send(
        json.dumps({"code": 0, "data": "Hello"})
    )

    try:
        while True:
            msg = await websocket.recv()
            username = get_cookie(websocket, "username")

            if not username:
                await websocket.send(
                    json.dumps({"code": -1})
                )
            else:
                await websocket.send(json.dumps({
                    "code": 0,
                    "data": f"received: {int(time.time())}"
                }))


    except websockets.ConnectionClosedError:
        await websocket.close()
        print("disconnected")
    except Exception as e:
        print("Error:", e.args)


def start_server(host="localhost"):
    server = websockets.serve(_start, host, 8888)

    asyncio.get_event_loop().run_until_complete(server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    start_server()
