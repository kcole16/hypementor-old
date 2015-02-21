from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'apps.profile.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^home/', 'apps.profile.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^submit/', 'apps.profile.views.submit', name='submit'),
    # url(r'^dashboard/', 'apps.profile.views.dashboard', name='dashboard'),
    url(r'^dashboard/(.+)/', 'apps.dashboard.views.dashboard', name='dashboard'),
    url(r'^searchdb/(.+)/', 'apps.dashboard.views.searchdb', name='searchdb'),
    url(r'^mentor_profile/(.+)/(.+)/', 'apps.dashboard.views.mentor_profile', name='mentor_profile'),
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}, name='login'),
    url(r'^user_login/$', 'apps.profile.views.user_login', name='user_login'),
    # url(r'^handle_yoauth/', 'core.views.handle_yoauth', name='handle_yoauth'),
    url(r'^logout', 'apps.profile.views.logout_view', name='logout'),

    url(r'^oauth/', 'apps.profile.views.oauth', name='oauth'),
)
