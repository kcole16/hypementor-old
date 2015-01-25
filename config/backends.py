import os
import requests

from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from apps.profile.models import Profile, Authorized
from apps.profile.utils import get_linkedin_profile, send_mail

class RestBackend(object):
    def authenticate(self,access_token):
        user_details = get_linkedin_profile(access_token)
        username = user_details['username']
        first_name = user_details['first_name']
        last_name = user_details['last_name']
        email= user_details['email']
        linkedin_id = user_details['linkedin_id']
        education = user_details['education']
        try:
            user = User.objects.get(username=username)
            try:
                profile = Profile.objects.get(user=user)
                try:
                    profile['access_token'] = access_token
                except TypeError:
                    pass
            except ObjectDoesNotExist:
                profile = Profile(user=user, access_token=access_token)
            profile.save()
        except User.DoesNotExist:
            user = User(username=username, first_name=first_name, 
                    last_name=last_name, email=email, password='None')
            user.save()
            profile = Profile(user=user, linkedin_id=linkedin_id, education=education,
                 access_token=access_token)
            profile.save()

            subject = "Welcome to HypeMentor"
            recipient = user.email
            html = """
                <center>
                    <img src="https://dl.dropboxusercontent.com/s/kyf0uyixix1tuk3/hypementor.png" style="width:120px;height:70px;">
                </center><br>
                <p>
                %s,<br>
                <br>Welcome to HypeMentor!<br>
                <br>We'll be reviewing your background and interests, 
                and will send you our resume review along with an introduction to your mentor over the next 24-48 hours. 
                After that, it's up to you!<br>
                <br>Feel free to contact us at any time if you have any questions.<br>
                <br>Best,<br>
                <br>The HypeMentor Team
                </p>
                """ % user.first_name
            sender = "kendall@hypementor.com"
            send_mail(subject, html, recipient, sender)
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)

        except User.DoesNotExist:
            return None