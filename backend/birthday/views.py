"""
API views for the Birthday website.

- BirthdayConfigView: Returns the singleton site configuration.
- MemoryPhotoListView: Returns all memory photos, ordered by the `order` field.
- GiftNoteCreateView: Allows visitors to submit gift notes.
"""

from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.response import Response

from .models import BirthdayPageConfig, MemoryPhoto, GiftNote
from .serializers import (
    BirthdayPageConfigSerializer,
    MemoryPhotoSerializer,
    GiftNoteSerializer,
)


class BirthdayConfigView(RetrieveAPIView):
    """
    GET /api/config/
    Returns the single BirthdayPageConfig instance.
    Creates a default one if it doesn't exist yet.
    """
    serializer_class = BirthdayPageConfigSerializer

    def get_object(self):
        # django-solo's .get_solo() handles get-or-create automatically
        return BirthdayPageConfig.get_solo()


class MemoryPhotoListView(ListAPIView):
    """
    GET /api/memories/
    Returns all memory photos ordered by their `order` field.
    """
    serializer_class = MemoryPhotoSerializer
    queryset = MemoryPhoto.objects.all()  # ordering is set in Meta


class GiftNoteCreateView(CreateAPIView):
    """
    POST /api/gift-notes/
    Allows visitors to leave a gift note on the shelf.
    """
    serializer_class = GiftNoteSerializer
    queryset = GiftNote.objects.all()
