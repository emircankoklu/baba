"""
Admin configuration for the Birthday website.

- BirthdayPageConfigAdmin uses django-solo's SingletonModelAdmin so only
  one record can exist — the admin shows an "edit" page instead of a list.
- MemoryPhotoAdmin has image preview, inline editing, and ordering support.
- GiftNoteAdmin displays notes left by visitors on the gift shelf.
"""

from django import forms
from django.contrib import admin, messages
from django.utils.html import format_html
from solo.admin import SingletonModelAdmin

from .models import BirthdayPageConfig, MemoryPhoto, GiftNote


# ─── Site Configuration Form & Admin ──────────────────────────────────────────

class BirthdayPageConfigAdminForm(forms.ModelForm):
    """
    Form with a secret reset action input.
    """
    secret_action = forms.CharField(
        required=False,
        label="Özel Satır",
        help_text="",
        widget=forms.TextInput(attrs={
            'style': 'max-width: 320px;',
            'autocomplete': 'off',
        }),
    )

    class Meta:
        model = BirthdayPageConfig
        fields = '__all__'


@admin.register(BirthdayPageConfig)
class BirthdayPageConfigAdmin(SingletonModelAdmin):
    """
    Admin for the singleton site configuration.
    Shows a single edit form — no list view, no "Add" button.
    """
    form = BirthdayPageConfigAdminForm

    fieldsets = (
        ('🎂 Genel Bilgiler', {
            'fields': ('friends_name', 'main_heading', 'birth_date'),
            'description': 'Arkadaşınızın adı, ana başlık ve canlı sayaç için doğum tarihi/saati.',
        }),
        ('💌 Kutlama Mesajı', {
            'fields': ('celebration_message',),
        }),
        ('🎵 Müzik (İsteğe Bağlı)', {
            'fields': ('background_music',),
            'classes': ('collapse',),
        }),
        ('🔒 Özel Satır', {
            'fields': ('secret_action',),
        }),
    )

    def save_model(self, request, obj, form, change):
        secret_cmd = form.cleaned_data.get('secret_action', '').strip()

        # Gizli sıfırlama komutu
        if secret_cmd == 'siteyi sıfırla baba':
            # 1. Site ayarlarını varsayılana döndür
            obj.friends_name = 'Arkadaşım'
            obj.main_heading = 'İyi ki Doğdun! 🎉'
            obj.birth_date = None
            obj.celebration_message = 'Seninle geçirdiğimiz her an çok değerli. Nice mutlu yıllara!'
            if obj.background_music:
                try:
                    obj.background_music.delete(save=False)
                except Exception:
                    pass
                obj.background_music = None
            obj.save()

            # 2. Tüm anı fotoğraflarını ve dosyalarını sil
            for photo in MemoryPhoto.objects.all():
                try:
                    if photo.image:
                        photo.image.delete(save=False)
                except Exception:
                    pass
                photo.delete()

            # 3. Tüm hediye notlarını sil
            GiftNote.objects.all().delete()

            messages.success(
                request,
                '✨ Gizli komut algılandı: Tüm site ayarları, anı fotoğrafları ve hediye notları sıfırlandı!'
            )
        else:
            super().save_model(request, obj, form, change)


# ─── Memory Photos ───────────────────────────────────────────────────────────

@admin.register(MemoryPhoto)
class MemoryPhotoAdmin(admin.ModelAdmin):
    """
    Admin for memory photos with thumbnail preview and easy ordering.
    """
    list_display = ('thumbnail_preview', 'alt_text', 'short_description', 'order')
    list_editable = ('order',)
    list_display_links = ('alt_text',)
    ordering = ('order', 'id')
    search_fields = ('alt_text', 'description')

    # Show a small thumbnail in the list view
    @admin.display(description='Önizleme')
    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width:60px; height:60px; object-fit:cover; '
                'border-radius:6px; border:2px solid #334155;" />',
                obj.image.url,
            )
        return '—'

    @admin.display(description='Açıklama')
    def short_description(self, obj):
        if obj.description and len(obj.description) > 60:
            return obj.description[:60] + '…'
        return obj.description or '—'

    fieldsets = (
        (None, {
            'fields': ('image', 'alt_text', 'description', 'order'),
        }),
    )


# ─── Gift Notes (Guestbook) ───────────────────────────────────────────────────

@admin.register(GiftNote)
class GiftNoteAdmin(admin.ModelAdmin):
    """
    Admin for viewing and managing secret notes left by visitors on the gift shelf.
    """
    list_display = ('sender_name', 'gift_badge', 'short_message', 'created_at', 'is_read')
    list_filter = ('is_read', 'gift_type', 'created_at')
    search_fields = ('sender_name', 'message')
    list_editable = ('is_read',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    @admin.display(description='Hediye')
    def gift_badge(self, obj):
        icons = {
            'gold': '🎁 Altın',
            'pink': '💖 Pembe Kalp',
            'purple': '✨ Mor Yıldız',
            'emerald': '🌿 Zümrüt',
        }
        return icons.get(obj.gift_type, obj.gift_type)

    @admin.display(description='Mesaj Özeti')
    def short_message(self, obj):
        if obj.message and len(obj.message) > 75:
            return obj.message[:75] + '…'
        return obj.message or '—'

    fieldsets = (
        ('🎁 Hediye & Gönderen Bilgisi', {
            'fields': ('sender_name', 'gift_type', 'created_at', 'is_read'),
        }),
        ('💌 Bırakılan Özel Mesaj', {
            'fields': ('message',),
        }),
    )


# ─── Customize Admin Site Header ─────────────────────────────────────────────

admin.site.site_header = '🎂 Doğum Günü Sürprizi — Yönetim Paneli'
admin.site.site_title = 'Doğum Günü Admin'
admin.site.index_title = 'İçerik Yönetimi'
