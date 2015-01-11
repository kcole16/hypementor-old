from django.shortcuts import render
from django.conf import settings
from django.http import Http404, HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render_to_response, render, redirect
from django.template import RequestContext
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, authenticate, login
from django.db import IntegrityError, connection, transaction
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User

from apps.profile.utils import authenticate_linkedin, upload_file_to_dropbox
from apps.profile.forms import SubmitForm
from apps.profile.models import Resume, Profile, Interest

from datetime import datetime
from uuid import uuid4
import os

@login_required
def home(request):
	return render_to_response('home.html', context_instance=RequestContext(request))

@login_required
def logout_view(request):
	logout(request)
	return redirect('login')

@login_required
def submit(request):
	user = request.user
	if request.POST:
		form = SubmitForm(request.POST, request.FILES)
		form.is_valid()
		file_name = upload_file_to_dropbox(request.FILES['file'], user)
		url = reverse('home')
		resume = Resume(user_id=user.id, file_name=file_name)
		resume.save()
		interest = Interest(user_id=user.id, industry=form.cleaned_data['industry'],
			position=form.cleaned_data['position'], location=form.cleaned_data['location'])
		interest.save()
		return HttpResponseRedirect(url)
	else:
		form = SubmitForm()
	return render_to_response('profile/submit.html',{'form':form}, context_instance=RequestContext(request))

def user_login(request):
	client_id = os.environ['LINKEDIN_CLIENT_ID']
	scope = 'r_fullprofile r_emailaddress'
	state = str(uuid4()).replace('-','')
	redirect_uri = '%s/oauth/' % str(os.environ['PATH_URL'])
	url = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=%s&scope=%s&state=%s&redirect_uri=%s' % (client_id, scope, state, redirect_uri)
	return HttpResponseRedirect(url)

def oauth(request):
	code = request.GET['code']
	access_token = authenticate_linkedin(code)
	user = authenticate(access_token=access_token)
	check_login = login(request, user)
	try:
		profile = Profile.objects.get(user_id=user.id)
	except ObjectDoesNotExist:
		url = reverse('home')
	else:
		url=reverse('submit')
	return HttpResponseRedirect(url) 
