from django import forms
from django.core.exceptions import ObjectDoesNotExist

from datetime import datetime

class SubmitForm(forms.Form):
    file = forms.FileField()
    industry = forms.CharField()
    position = forms.CharField()
    location = forms.CharField()

