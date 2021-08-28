import asyncio
import websockets
import time


async def _start(websocket, path):
    mark = "*" * 20

    await websocket.send("Hello")

    async for msg in websocket:
        print(f"{mark}{msg}{mark}")

        await websocket.send(f"received: {int(time.time())}")


def start_server():
    server = websockets.serve(_start, "localhost", 8888)

    asyncio.get_event_loop().run_until_complete(server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    start_server()
