from django.http import Http404, HttpResponse, HttpResponseBadRequest, \
    HttpResponseRedirect
from django.shortcuts import get_object_or_404, render_to_response, render, \
    redirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from apps.dashboard.utils import search_es, send_mail
from apps.profile.utils import connect_mongodb
from apps.dashboard.forms import IndustryForm, MessageForm
from apps.profile.models import Profile

import json


@login_required
def dashboard(request):
    mentors = None
    if request.POST:
        form = IndustryForm(request.POST)
        if form.is_valid():
            user = User.objects.get(id=request.user.id)
            linkedin_id = Profile.objects.get(user_id=user.id).linkedin_id
            db = connect_mongodb()
            client_code = db.authorized.find_one({'linkedin_id': linkedin_id})['client_code']
            client_short_name = db.clients.find_one({'client_code': client_code})['short_name']
            query = form.cleaned_data['industry']
            mentors = search_es(query, client_short_name)
        else:
            print form.errors
    else:
        form = IndustryForm()
    return render_to_response('dashboard/dashboard.html',
                              {'form': form, 'mentors': mentors},
                              context_instance=RequestContext(request))

@login_required
def message(request):
    submitted = False
    if request.POST:
        form = MessageForm(request.POST)
        if form.is_valid():
            user = User.objects.get(id=request.user.id)
            linkedin_id = Profile.objects.get(user_id=user.id).linkedin_id
            db = connect_mongodb()
            client_code = db.authorized.find_one({'linkedin_id': linkedin_id})[
                'client_code']
            client_short_name = \
                db.clients.find_one({'client_code': client_code})['short_name']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            mentor_id = form.cleaned_data['mentor_id']
            query = "db.%s.find_one({'linkedin_id':'%s'})" % (
                client_short_name, mentor_id)
            mentor = eval(query)
            send_mail(subject, message, mentor['email'], user.email)
            submitted = True
        else:
            print form.errors
    else:
        mentor_id = request.GET['mi']
        user = User.objects.get(id=request.user.id)
        linkedin_id = Profile.objects.get(user_id=user.id).linkedin_id
        db = connect_mongodb()
        client_code = db.authorized.find_one({'linkedin_id': linkedin_id})[
            'client_code']
        client_short_name = db.clients.find_one({'client_code': client_code})[
            'short_name']
        query = "db.%s.find_one({'linkedin_id':'%s'})" % (
            client_short_name, mentor_id)
        mentor = eval(query)
        form = MessageForm()
    return render_to_response('dashboard/message.html',
                              {'form': form, 'mentor': mentor,
                               'mentor_id': mentor_id, 'submitted': submitted},
                              context_instance=RequestContext(request))

def searchdb(request):
    linkedin_id = Profile.objects.get(user_id=request.user.id).linkedin_id
    db = connect_mongodb()
    client_code = db.authorized.find_one({'linkedin_id': linkedin_id})[
        'client_code']
    client_short_name = db.clients.find_one({'client_code': client_code})[
        'short_name']
    query = request.GET['industry']
    mentors = json.dumps(search_es(query, client_short_name))
    return HttpResponse(json.dumps(mentors))

@login_required
def mentor_profile(request, linkedin_id):
    db = connect_mongodb()
    client_code = db.authorized.find_one({'linkedin_id': linkedin_id})[
        'client_code']
    client_short_name = db.clients.find_one({'client_code': client_code})[
        'short_name']
    query = "db.%s.find_one({'linkedin_id':'%s'})" % (
        client_short_name, linkedin_id)
    mentor = eval(query)
    return render_to_response('dashboard/mentor_profile.html',
                              {'mentor': mentor,
                               'client_code': client_code},
                              context_instance=RequestContext(request))
