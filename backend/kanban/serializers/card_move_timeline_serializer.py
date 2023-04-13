from rest_framework import serializers
from kanban.models import CardMoveTimeline


class CardMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardMoveTimeline
        exclude = ('deleted_at',)
