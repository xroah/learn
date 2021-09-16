from fastapi import FastAPI, Response

api_app = FastAPI()


@api_app.get("/")
def main(res: Response):
    res.headers["Content-Type"] = "text/html"

    return "Hello world"

