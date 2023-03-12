from rest_framework import serializers
from kanban.models import Card
from kanban.models import Row
from kanban.serializers.card_serializer import CardSerializer



class RowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Row
        exclude = ('deleted_at',)