# Generated manually for adding user_avatar field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0013_application_long_term_enable_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='user_avatar',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='User Avatar'),
        ),
        migrations.AddField(
            model_name='applicationversion',
            name='user_avatar',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='User Avatar'),
        ),
    ]
