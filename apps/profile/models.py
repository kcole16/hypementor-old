from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

class Profile(models.Model):
	user = models.ForeignKey(User)
	access_token = models.CharField(max_length=500)
	linkedin_id = models.CharField(max_length=500)
	education = models.CharField(max_length=500)

class Resume(models.Model):
	user = models.ForeignKey(User)
	file_name = models.CharField(max_length=500)

class Interest(models.Model):
	user = models.ForeignKey(User)
	industry = models.CharField(max_length=500)
	position = models.CharField(max_length=500)
	location = models.CharField(max_length=500)

# Create your models here.
