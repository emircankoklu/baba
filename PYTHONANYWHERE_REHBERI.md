# 🎂 PythonAnywhere Yayınlama Rehberi (https://emitshh.pythonanywhere.com)

Bu rehber, Doğum Günü web sitesi ve yönetim panelini **sadece PythonAnywhere** üzerinde tek bir sunucu olarak sorunsuz ve canlı çalıştırmanız için hazırlanmıştır.

---

## 🛠️ 1. Hazırlık ve Dosyaların Yüklenmesi

1. [PythonAnywhere](https://www.pythonanywhere.com/) hesabınıza giriş yapın (`emitshh`).
2. Bilgisayarınızdaki `backend` klasörünü (içinde derlenmiş `frontend_dist`, `media`, `birthday_project` vb. bulunan klasör) bir ZIP dosyası haline getirin veya GitHub reposu oluşturup PythonAnywhere Bash konsolundan çekin.
3. PythonAnywhere **Files** sekmesinden `/home/emitshh/` altına yükleyip açın (Örn: `/home/emitshh/baba/backend`).

---

## 🐍 2. PythonAnywhere Bash Konsolunda Virtualenv & Paket Kurulumu

PythonAnywhere **Consoles** sekmesinden bir **Bash** konsolu açın ve aşağıdaki komutları sırasıyla çalıştırın:

```bash
# 1. Sanal ortamı (virtualenv) oluşturun (Python 3.10 veya 3.11)
mkvirtualenv --python=/usr/bin/python3.10 birthday-venv

# 2. Backend klasörüne gidin
cd /home/emitshh/baba/backend

# 3. Gerekli kütüphaneleri yükleyin
pip install -r requirements.txt

# 4. Veritabanını oluşturun
python manage.py migrate

# 5. Yönetici (Admin) hesabı oluşturun
python manage.py createsuperuser

# 6. Django Admin CSS/JS statik dosyalarını toplayın
python manage.py collectstatic --noinput
```

---

## 🌐 3. Web Sekmesi Ayarları (PythonAnywhere Dashboard -> Web)

1. PythonAnywhere **Web** sekmesine gidin.
2. **"Add a new web app"** butonuna tıklayın.
3. **"Manual configuration"** seçeneğini seçin -> **Python 3.10** seçip bitirin.
4. Aşağıdaki ayarları ilgili bölümlere yazın:

### A) Code Bölümü
- **Source code:** `/home/emitshh/baba/backend`
- **Working directory:** `/home/emitshh/baba/backend`

### B) WSGI configuration file
- `/var/www/emitshh_pythonanywhere_com_wsgi.py` bağlantısına tıklayın.
- İçindeki varsayılan kodları silip sadece aşağıdakini yapıştırın ve **Save** butonuna tıklayın:

```python
import os
import sys

# Proje dizini
path = '/home/emitshh/baba/backend'
if path not in sys.path:
    sys.path.append(path)

# Django ayar modülü
os.environ['DJANGO_SETTINGS_MODULE'] = 'birthday_project.settings'

# WSGI uygulamasını başlat
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### C) Virtualenv Bölümü
- **Virtualenv path:** `/home/emitshh/.virtualenvs/birthday-venv`

### D) Static Files Bölümü (Çok Önemli!)
Sayfanın altındaki **Static files** tablosuna şu 3 satırı ekleyin:

| URL | Directory |
|---|---|
| `/static/` | `/home/emitshh/baba/backend/staticfiles` |
| `/media/` | `/home/emitshh/baba/backend/media` |
| `/_next/` | `/home/emitshh/baba/backend/frontend_dist/_next` |

---

## 🚀 4. Yayına Alma (Reload)

1. Web sekmesinin en üstündeki büyük yeşil **"Reload emitshh.pythonanywhere.com"** butonuna tıklayın.
2. Tarayıcınızdan **[https://emitshh.pythonanywhere.com/](https://emitshh.pythonanywhere.com/)** adresini açın! 🎉

---

## ⚙️ İçerikleri Yönetme ve Düzenleme

- **Yönetim Paneli:** `https://emitshh.pythonanywhere.com/admin/`
- Buradan:
  - Arkadaşınızın adını, kutlama başlığını ve mesajını değiştirebilirsiniz.
  - Doğum tarihini ayarlayarak canlı sayaç açabilirsiniz.
  - Arka plan müziği (mp3) yükleyebilirsiniz.
  - **Anı Fotoğrafları** ekleyip sıralayabilirsiniz.
  - Ziyaretçilerin bıraktığı hediye notlarını okuyabilirsiniz.
