# Generated by Django 4.1.7 on 2023-04-05 20:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kanban', '0007_alter_row_options_card_has_bug_card_is_card_finished'),
    ]

    operations = [
        migrations.CreateModel(
            name='CardMoveTimeline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_at', models.DateTimeField(blank=True, null=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='kanban.board')),
                ('card', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='card_move_timeline', to='kanban.card')),
                ('row', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='kanban.row')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
