from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
import os
from pymongo import MongoClient

app = FastAPI()
mongo = MongoClient("localhost", 27017)
db = mongo.site
users_collection = db.users

@app.get("/", response_class=HTMLResponse)
async def main():
    with open(f"{os.getcwd()}/index.html") as f:
        return f.read()


@app.get("/users")
async def get_users():
    users = users_collection.find({})
    ret = []
    
    for user in users:
        user["_id"] = str(user["_id"])
        ret.append(user)

    return {
        "code": 0,
        "data": ret
    }

@app.post("/save_user")
async def save_user(req: Request):
    body = await req.json()
    print("bbbbb", body, type(body))
    users_collection.insert_one({
        "username": body["username"],
        "gender": body["gender"]
    })
    
    return {
        "code": 0,
        "data": list()
    }