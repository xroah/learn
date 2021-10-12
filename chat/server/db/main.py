from pymongo import MongoClient

_client = MongoClient("localhost", 27017)
db = _client["chat"]
