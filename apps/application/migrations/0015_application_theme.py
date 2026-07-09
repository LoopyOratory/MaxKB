# Generated manually for adding theme field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0014_application_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='theme',
            field=models.CharField(blank=True, default='blue', max_length=32, verbose_name='Chat widget theme preset'),
        ),
        migrations.AddField(
            model_name='applicationversion',
            name='theme',
            field=models.CharField(blank=True, default='blue', max_length=32, verbose_name='Chat widget theme preset'),
        ),
    ]
