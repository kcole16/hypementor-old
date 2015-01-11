from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'apps.profile.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^submit/', 'apps.profile.views.submit', name='submit'),
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}, name='login'),
    url(r'^user_login/$', 'apps.profile.views.user_login', name='user_login'),
    # url(r'^handle_yoauth/', 'core.views.handle_yoauth', name='handle_yoauth'),
    url(r'^logout', 'apps.profile.views.logout_view', name='logout'),

    url(r'^oauth/', 'apps.profile.views.oauth', name='oauth'),
)
