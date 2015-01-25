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

from apps.dashboard.utils import connect_db

import pymongo

from datetime import datetime
from uuid import uuid4
import os

@login_required
def dashboard(request, client_code):
	query_url = "http://localhost:5000/mentors/%s/" % client_code
	# print client_code
	# db = connect_db('MONGOLAB_URI', 'MONGOLAB_APP_NAME')
	# client_short_name = db.clients.find_one({'client_code':client_code})['short_name']
	# mentors = eval('db.%s.find()' % client_short_name)

	return render_to_response('dashboard/dashboard.html',{'query_url':query_url}, context_instance=RequestContext(request))

