from django import forms
from django.core.exceptions import ObjectDoesNotExist

from datetime import datetime

class IndustryForm(forms.Form):
    industry = forms.CharField()

class MessageForm(forms.Form):
    subject = forms.CharField()
    message = forms.CharField()
    mentor_id = forms.CharField()