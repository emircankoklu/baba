# 🎂 PythonAnywhere-Bereitstellungsanleitung (https://emitshh.pythonanywhere.com)

Diese Anleitung beschreibt, wie du die Geburtstagsseite und die Administration auf **PythonAnywhere** als eine laufende Anwendung veröffentlichst.

---

## 🛠️ 1. Vorbereitung und Dateien

1. Melde dich bei [PythonAnywhere](https://www.pythonanywhere.com/) an (`emitshh`).
2. Öffne eine Bash-Konsole und klone das Repository direkt auf PythonAnywhere.
3. Verwende als Projektpfad `/home/emitshh/baba`.

## 🐍 2. Virtuelle Umgebung und Pakete

Führe die folgenden Befehle in der PythonAnywhere-Bash-Konsole aus:

```bash
cd /home/emitshh
git clone https://github.com/emircankoklu/baba.git
cd /home/emitshh/baba/backend
mkvirtualenv --python=/usr/bin/python3.10 birthday-venv
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

## 🌐 3. Einstellungen im Web-Tab

1. Öffne den **Web**-Tab und wähle **Add a new web app**.
2. Wähle **Manual configuration** und **Python 3.10**.
3. Setze **Source code** und **Working directory** auf `/home/emitshh/baba/backend`.
4. Setze die virtuelle Umgebung auf `/home/emitshh/.virtualenvs/birthday-venv`.
5. Trage in der Tabelle **Static files** diese Pfade ein:

| URL | Directory |
|---|---|
| `/static/` | `/home/emitshh/baba/backend/staticfiles` |
| `/media/` | `/home/emitshh/baba/backend/media` |
| `/_next/` | `/home/emitshh/baba/backend/frontend_dist/_next` |

Öffne die WSGI-Datei `/var/www/emitshh_pythonanywhere_com_wsgi.py`, ersetze ihren Inhalt und speichere:

```python
import os
import sys

path = '/home/emitshh/baba/backend'
if path not in sys.path:
  sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'birthday_project.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## 🚀 4. Neustart

Klicke im Web-Tab auf **Reload emitshh.pythonanywhere.com** und öffne anschließend [https://emitshh.pythonanywhere.com/](https://emitshh.pythonanywhere.com/).

## ⚙️ Inhalte verwalten

Die Administration erreichst du unter `https://emitshh.pythonanywhere.com/admin/`. Dort kannst du Namen, Glückwunschtext, Geburtsdatum, Musik, Erinnerungsfotos und hinterlassene Geschenknachrichten verwalten.
