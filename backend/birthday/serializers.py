"""
DRF Serializers for the Birthday API.
"""

from rest_framework import serializers
from .models import BirthdayPageConfig, MemoryPhoto, GiftNote


class BirthdayPageConfigSerializer(serializers.ModelSerializer):
    """Serializes the singleton site configuration."""

    # Return the full URL for the music file (if uploaded)
    background_music = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = BirthdayPageConfig
        fields = [
            'friends_name',
            'main_heading',
            'birth_date',
            'celebration_message',
            'background_music',
        ]


class MemoryPhotoSerializer(serializers.ModelSerializer):
    """Serializes a single memory photo."""

    # Return absolute URL so the frontend can use it directly in <img> tags
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = MemoryPhoto
        fields = [
            'id',
            'image',
            'alt_text',
            'description',
            'order',
        ]


class GiftNoteSerializer(serializers.ModelSerializer):
    """Serializes gift notes submitted by visitors."""

    class Meta:
        model = GiftNote
        fields = [
            'id',
            'sender_name',
            'message',
            'gift_type',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
