from django.shortcuts import render
from django.conf import settings
from django.http import Http404, HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render_to_response, render, redirect
from django.template import RequestContext
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.conf import settings

from apps.dashboard.utils import connect_db, search_es
from apps.dashboard.forms import IndustryForm

import pymongo

from datetime import datetime
from uuid import uuid4
import os

@login_required
def dashboard(request, client_code):
	mentors = None
	if request.POST:
		form = IndustryForm(request.POST)
		if form.is_valid():
			db = connect_db('MONGOLAB_URI', 'APP_NAME')
			client_short_name = db.clients.find_one({'client_code':client_code})['short_name']
			query = form.cleaned_data['industry']
			mentors = search_es(query, client_short_name)
			# query = "db.%s.find({'industry':'%s'})" % (client_short_name,industry)
			# print query
			# mentors = eval(query)
		else:
			print form.errors
	else:
		form = IndustryForm()
	return render_to_response('dashboard/dashboard.html',{'form':form, 'mentors':mentors, 'client_code':client_code}, context_instance=RequestContext(request))

@login_required
def mentor_profile(request, client_code, mentor_id):
	db = connect_db('MONGOLAB_URI', 'APP_NAME')
	client_short_name = db.clients.find_one({'client_code':client_code})['short_name']
	query = "db.%s.find_one({'linkedin_id':'%s'})" % (client_short_name, mentor_id)
	print query
	mentor = eval(query)
	return render_to_response('dashboard/mentor_profile.html', {'mentor':mentor, 'client_code':client_code}, context_instance=RequestContext(request))


