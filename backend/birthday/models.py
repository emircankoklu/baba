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
        default='Arkadaşım',
        verbose_name='Arkadaşın Adı',
        help_text='Doğum günü kutlanacak kişinin adı.',
    )
    main_heading = models.CharField(
        max_length=255,
        default='İyi ki Doğdun! 🎉',
        verbose_name='Ana Başlık',
        help_text='Sayfanın en üstünde gösterilecek büyük başlık.',
    )
    birth_date = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Doğum Tarihi ve Saati',
        help_text='Canlı sayaç için doğum tarihi ve saatini belirleyin (İsteğe bağlı).',
    )
    celebration_message = models.TextField(
        default='Seninle geçirdiğimiz her an çok değerli. Nice mutlu yıllara!',
        verbose_name='Kutlama Mesajı',
        help_text='Ana kutlama mesajı — birden fazla paragraf yazabilirsiniz.',
    )
    background_music = models.FileField(
        upload_to='music/',
        blank=True,
        null=True,
        verbose_name='Arka Plan Müziği',
        help_text='İsteğe bağlı — MP3 veya WAV dosyası yükleyin.',
    )

    class Meta:
        verbose_name = 'Site Ayarları'
        verbose_name_plural = 'Site Ayarları'

    def __str__(self):
        return f'Doğum Günü Ayarları — {self.friends_name}'


class MemoryPhoto(models.Model):
    """
    A single memory photo to display in the card fan carousel.
    Upload images and set descriptions from the Admin panel.
    """

    image = models.ImageField(
        upload_to='memories/',
        verbose_name='Fotoğraf',
        help_text='Anı fotoğrafı — kare veya yatay formatta en iyi görünür.',
    )
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        default='',
        verbose_name='Alt Metin',
        help_text='Erişilebilirlik için kısa açıklama.',
    )
    description = models.TextField(
        blank=True,
        default='',
        verbose_name='Açıklama',
        help_text='Bu anıyla ilgili kısa bir not veya hikaye.',
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama',
        help_text='Düşük sayılar önce gösterilir.',
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Anı Fotoğrafı'
        verbose_name_plural = 'Anı Fotoğrafları'

    def __str__(self):
        return self.alt_text or f'Fotoğraf #{self.pk}'


class GiftNote(models.Model):
    """
    Gift notes left by visitors on the gift shelf.
    Only readable by the birthday person (and admin).
    """

    GIFT_TYPE_CHOICES = [
        ('gold', 'Altın Kutu 🎁'),
        ('pink', 'Pembe Kalp Kutu 💖'),
        ('purple', 'Mor Yıldız Kutu ✨'),
        ('emerald', 'Zümrüt Sürpriz Kutu 🌿'),
    ]

    sender_name = models.CharField(
        max_length=120,
        verbose_name='Gönderenin Adı',
        help_text='Notu bırakan kişinin adı veya takma adı.',
    )
    message = models.TextField(
        verbose_name='Mesaj / Not',
        help_text='Doğum günü sahibine özel bırakılan mesaj.',
    )
    gift_type = models.CharField(
        max_length=50,
        choices=GIFT_TYPE_CHOICES,
        default='gold',
        verbose_name='Hediye Türü',
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name='Okundu mu?',
        help_text='Doğum günü sahibi veya admin bu notu okuduysa işaretleyin.',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Bırakılma Tarihi',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Hediye Notu'
        verbose_name_plural = 'Bırakılan Hediye Notları'

    def __str__(self):
        return f'{self.sender_name} — {self.created_at.strftime("%d.%m.%Y %H:%M")}'
