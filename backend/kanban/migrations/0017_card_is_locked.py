# Generated by Django 4.1.7 on 2023-03-21 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kanban', '0016_alter_user_avatar_alter_user_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='is_locked',
            field=models.BooleanField(default=False),
        ),
    ]