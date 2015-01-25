from django import forms
from django.core.exceptions import ObjectDoesNotExist

from datetime import datetime

class IndustryForm(forms.Form):
    industry = forms.CharField()