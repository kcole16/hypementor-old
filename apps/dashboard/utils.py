from django.contrib.auth.models import User

import requests
import os
import pymongo

def connect_db(url, app_name):
    client = pymongo.MongoClient(os.environ[url])
    db = client[os.environ[app_name]]
    return db