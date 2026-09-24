from django.db import migrations, models


MESSAGE = (
    'Du hast meinem kleinen Spiel so viel Freude und Leben geschenkt. '
    'Mit deiner Begeisterung, deinen Nachrichten und deiner neugierigen Art '
    'machst du jeden Moment für mich besonderer. Es bedeutet mir sehr viel, '
    'dass du dich auf diese Überraschung einlässt und dich über die kleinen '
    'Dinge so ehrlich freust. Du bist ein ganz besonderer Mensch, und ich '
    'bin froh, dass es dich gibt. Ich hoffe, dein Geburtstag schenkt dir '
    'mindestens so viel Freude, wie du mir mit deiner Art schenkst. '
    'Alles Gute zum Geburtstag!'
)


def update_default_message(apps, schema_editor):
    BirthdayPageConfig = apps.get_model('birthday', 'BirthdayPageConfig')
    BirthdayPageConfig.objects.filter(
        celebration_message='Jeder Moment mit dir ist kostbar. Auf viele glückliche Jahre!'
    ).update(celebration_message=MESSAGE)


class Migration(migrations.Migration):
    dependencies = [
        ('birthday', '0003_alter_birthdaypageconfig_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='birthdaypageconfig',
            name='celebration_message',
            field=models.TextField(
                default=MESSAGE,
                help_text='Haupttext der Feier; du kannst mehrere Absätze schreiben.',
                verbose_name='Glückwunschtext',
            ),
        ),
        migrations.RunPython(update_default_message, migrations.RunPython.noop),
    ]