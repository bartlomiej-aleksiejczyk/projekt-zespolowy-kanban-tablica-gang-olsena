# Generated by Django 4.1.7 on 2023-03-20 00:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kanban', '0013_alter_user_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='images'),
        ),
    ]
