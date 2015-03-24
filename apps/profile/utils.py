from django.contrib.auth.models import User

import requests
import json
import os
from bs4 import BeautifulSoup
import dropbox
import pymongo

def authenticate_linkedin(code):
    url = 'https://www.linkedin.com/uas/oauth2/accessToken'
    client_id = os.environ['LINKEDIN_CLIENT_ID']
    client_secret = os.environ['LINKEDIN_CLIENT_SECRET']
    data = {
    'client_id': client_id,
    'client_secret': client_secret,
    'redirect_uri': '%s/oauth/' % str(os.environ['PATH_URL']),
    'code': code,
    'grant_type': 'authorization_code'
    }
    r = requests.post(url, data=data)
    access_token = r.json()['access_token']
    return access_token

def parse_profile(profile):
    xml = BeautifulSoup(profile)
    linkedin_id = xml.find('id').string
    first_name = xml.find('first-name').string
    last_name = xml.find('last-name').string
    email = xml.find('email-address').string
    try:
        education = xml.find_all('school-name')[0].string
    except IndexError:
        education = None
    username = email.split('@')[0]
    user_details = {'username':username, 'linkedin_id':linkedin_id, 
        'first_name':first_name, 'education':education,
        'last_name':last_name, 'email':email}
    return user_details

def get_linkedin_profile(access_token):
    url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,educations)'
    headers = {
        'Host':'api.linkedin.com',
        'Connection':'Keep-Alive',
        'Authorization': 'Bearer %s' % access_token
    }
    r = requests.get(url, headers=headers)
    if r.ok:
        user_details = parse_profile(r.text)
    else:
        user_details = None
    return user_details

def upload_file_to_dropbox(file, user):
    access_token = os.environ['DROPBOX_ACCESS_TOKEN']
    user_email = user.email

    subject = "ALERT: New Resume Received"
    html = "<p>Resume received from user: %s!<p>" % user_email
    recipients = os.environ['ALERT_RECIPIENTS'].split(',')
    send_mail(subject,html,recipients,'kcole16@gmail.com')

    client = dropbox.client.DropboxClient(access_token)
    response = client.put_file('/%s.pdf' % user_email, file)
    try:
        file_name = response['path']
    except KeyError:
        file_name = "Error"
    return file_name

def send_mail(subject, html, recipients, sender):
    r = requests.post(
        "https://api.mailgun.net/v2/%s.mailgun.org/messages" % os.environ['APP_NAME'],
        auth=("api", os.environ['MAILGUN_API_KEY']),
        data={"from": "%s" % sender,
              "to": recipients,
              "subject": subject,
              "html": html})
    if r.ok:
        pass
    else:
        raise KeyError

def connect_mongodb():
    client = pymongo.MongoClient(os.environ['MONGOLAB_URI'])
    db = client[os.environ['APP_NAME']]

    return db





