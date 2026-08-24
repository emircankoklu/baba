"""
Root URL configuration for birthday_project.

- /         -> Serves the compiled Next.js Birthday web page
- /admin/   -> Django Administration
- /api/     -> REST API for configuration, memories, and gift notes
- /_next/   -> Static JS/CSS assets from Next.js export
"""

import os
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('birthday.urls')),
    re_path(r'^_next/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'frontend_dist', '_next')}),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^(?P<path>.*\.(?:png|jpg|jpeg|svg|ico|json|txt))$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'frontend_dist')}),
]
