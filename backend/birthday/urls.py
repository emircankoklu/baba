"""
URL routing for the Birthday API.

/api/config/      -> Site configuration (singleton)
/api/memories/    -> Memory photo list
/api/gift-notes/  -> Post gift notes (guestbook)
"""

from django.urls import path
from .views import BirthdayConfigView, MemoryPhotoListView, GiftNoteCreateView

urlpatterns = [
    path('config/', BirthdayConfigView.as_view(), name='birthday-config'),
    path('memories/', MemoryPhotoListView.as_view(), name='memory-photo-list'),
    path('gift-notes/', GiftNoteCreateView.as_view(), name='gift-note-create'),
]
