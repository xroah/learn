import asyncio
import websockets


async def _start(websocket, path):
    await websocket.send("Hello")


def start_server():
    server = websockets.serve(_start, "localhost", 8888)

    asyncio.get_event_loop().run_until_complete(server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    start_server()
