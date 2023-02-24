from rest_framework import serializers
from kanban.models import Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        exclude = ('deleted_at',)