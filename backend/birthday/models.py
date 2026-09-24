"""
Models for the Birthday Surprise website.

BirthdayPageConfig  — Singleton model (one row only) holding global site settings.
                        Managed via django-solo for admin convenience.
MemoryPhoto         — Sortable collection of memory photos for the card carousel.
GiftNote            — Guestbook / secret gift notes left by visitors for the birthday person.
"""

from django.db import models
from solo.models import SingletonModel


class BirthdayPageConfig(SingletonModel):
    """
    Singleton configuration for the birthday website.
    Only one instance of this model will ever exist.
    Edit all text/media from the Django Admin panel — no code changes needed.
    """

    friends_name = models.CharField(
        max_length=120,
        default='Mein Schatz',
        verbose_name='Name der geehrten Person',
        help_text='Name der Person, deren Geburtstag gefeiert wird.',
    )
    main_heading = models.CharField(
        max_length=255,
        default='Alles Gute zum Geburtstag! 🎉',
        verbose_name='Hauptüberschrift',
        help_text='Große Überschrift am oberen Rand der Seite.',
    )
    birth_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Geburtsdatum und -zeit',
        help_text='Geburtsdatum und -zeit für den Live-Zähler (optional).',
    )
    celebration_message = models.TextField(
        default='Du hast meinem kleinen Spiel so viel Freude und Leben geschenkt. Mit deiner Begeisterung, deinen Nachrichten und deiner neugierigen Art machst du jeden Moment für mich besonderer. Es bedeutet mir sehr viel, dass du dich auf diese Überraschung einlässt und dich über die kleinen Dinge so ehrlich freust. Du bist ein ganz besonderer Mensch, und ich bin froh, dass es dich gibt. Ich hoffe, dein Geburtstag schenkt dir mindestens so viel Freude, wie du mir mit deiner Art schenkst. Alles Gute zum Geburtstag!',
        verbose_name='Glückwunschtext',
        help_text='Haupttext der Feier; du kannst mehrere Absätze schreiben.',
    )
    background_music = models.FileField(
        upload_to='music/',
        blank=True,
        null=True,
        verbose_name='Hintergrundmusik',
        help_text='Optional; lade eine MP3- oder WAV-Datei hoch.',
    )

    class Meta:
        verbose_name = 'Seiteneinstellungen'
        verbose_name_plural = 'Seiteneinstellungen'

    def __str__(self):
        return f'Geburtstagseinstellungen — {self.friends_name}'


class MemoryPhoto(models.Model):
    """
    A single memory photo to display in the card fan carousel.
    Upload images and set descriptions from the Admin panel.
    """

    image = models.ImageField(
        upload_to='memories/',
        verbose_name='Foto',
        help_text='Erinnerungsfoto; quadratisch oder im Querformat sieht es am besten aus.',
    )
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        default='',
        verbose_name='Alternativtext',
        help_text='Kurze Beschreibung für die Barrierefreiheit.',
    )
    description = models.TextField(
        blank=True,
        default='',
        verbose_name='Beschreibung',
        help_text='Kurze Notiz oder Geschichte zu dieser Erinnerung.',
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Reihenfolge',
        help_text='Niedrigere Zahlen werden zuerst angezeigt.',
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Erinnerungsfoto'
        verbose_name_plural = 'Erinnerungsfotos'

    def __str__(self):
        return self.alt_text or f'Foto #{self.pk}'


class GiftNote(models.Model):
    """
    Gift notes left by visitors on the gift shelf.
    Only readable by the birthday person (and admin).
    """

    GIFT_TYPE_CHOICES = [
        ('gold', 'Goldene Box 🎁'),
        ('pink', 'Rosa Herzbox 💖'),
        ('purple', 'Violette Sternenbox ✨'),
        ('emerald', 'Smaragdgrüne Überraschungsbox 🌿'),
    ]

    sender_name = models.CharField(
        max_length=120,
        verbose_name='Name des Absenders',
        help_text='Name oder Spitzname der Person, die die Nachricht hinterlässt.',
    )
    message = models.TextField(
        verbose_name='Nachricht / Notiz',
        help_text='Persönliche Nachricht für das Geburtstagskind.',
    )
    gift_type = models.CharField(
        max_length=50,
        choices=GIFT_TYPE_CHOICES,
        default='gold',
        verbose_name='Geschenktyp',
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name='Gelesen?',
        help_text='Aktivieren, wenn das Geburtstagskind oder die Administration die Nachricht gelesen hat.',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Hinterlassen am',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Geschenknachricht'
        verbose_name_plural = 'Hinterlassene Geschenknachrichten'

    def __str__(self):
        return f'{self.sender_name} — {self.created_at.strftime("%d.%m.%Y %H:%M")}'
