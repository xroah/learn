import asyncio
import websockets
import time


async def _start(websocket, path):
    mark = "*" * 20

    await websocket.send("Hello")

    try:
        while True:
            msg = await websocket.recv()

            print(f"{mark}{msg}{mark}")
            await websocket.send(f"received: {int(time.time())}")
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
