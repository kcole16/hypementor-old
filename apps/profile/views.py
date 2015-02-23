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
from django.utils.datastructures import MultiValueDictKeyError
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required

from apps.profile.utils import authenticate_linkedin, upload_file_to_dropbox, get_linkedin_profile, connect_mongodb
from apps.profile.forms import SubmitForm
from apps.profile.models import Resume, Profile, Interest, Authorized

from datetime import datetime
from uuid import uuid4
import os

@login_required
def home(request):
	profile = Profile.objects.get(user_id=request.user.id)
	client_code = Authorized.objects.get(linkedin_id=profile.linkedin_id).client_code
	url = reverse('dashboard', args=(client_code,))
	return redirect(url)

@login_required
def logout_view(request):
	logout(request)
	return redirect('login')

@login_required
def dashboard(request):
	users = User.objects.raw("select * from auth_user au inner join profile_profile pp on pp.user_id = au.id inner join profile_interest pi on pi.user_id = au.id inner join profile_resume pr on pr.user_id = au.id ")
	return render_to_response('profile/dashboard.html', {'users':users}, context_instance=RequestContext(request))

@login_required
def submit(request):
	upload_error = False
	user = request.user
	industries = settings.INDUSTRIES
	if request.POST:
		form = SubmitForm(request.POST, request.FILES)
		form.is_valid()
		try:
			file_name = upload_file_to_dropbox(request.FILES['file'], user)
		except MultiValueDictKeyError:
			upload_error = True
		else:
			url = reverse('home')
			resume = Resume(user_id=user.id, file_name=file_name)
			resume.save()
			interest = Interest(user_id=user.id, industry=form.cleaned_data['industry'],
				position=form.cleaned_data['position'], location=form.cleaned_data['location'])
			interest.save()
			return HttpResponseRedirect(url)
	else:
		form = SubmitForm()
	return render_to_response('profile/submit.html',{'form':form, 'upload_error':upload_error, 'industries':industries}, context_instance=RequestContext(request))

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
	linkedin_id = get_linkedin_profile(access_token)['linkedin_id']
	db = connect_mongodb()
	authorized = db.authorized.find_one({'linkedin_id':linkedin_id})
	if authorized == None:
		return render_to_response('profile/unauthorized.html', context_instance=RequestContext(request)) 
	else:
		user = authenticate(access_token=access_token)
		check_login = login(request, user)
		profile = Profile.objects.get(user_id=user.id)
		client_code = authorized['client_code']
		url = reverse('dashboard', args=(client_code,))
		return HttpResponseRedirect(url)
