from django.contrib.auth.models import User

import requests
import os
import pymongo
from elasticsearch import Elasticsearch


def connect_db(url, app_name):
    client = pymongo.MongoClient(os.environ[url])
    db = client[os.environ[app_name]]
    return db

def search_es(query, index):
	es = Elasticsearch(os.environ['BONSAI_URL'])
	res = es.search(index=index, body={"query": {
	    "flt": {
	      "like_text": query,
	      "fuzziness": 0.5,
	    }
	  }
	})
	results = [ mentor['_source'] for mentor in res['hits']['hits'] ]
	return results

def send_mail(subject, message, recipients, sender):
    ret = requests.post(
        "https://api.mailgun.net/v2/hypementor.com/messages",
        auth=("api", os.environ['MAILGUN_API_KEY']),
        data={"from": "%s" % sender,
              "to": recipients,
              "subject": subject,
              "text": message})
    print ret.json()
    return ret