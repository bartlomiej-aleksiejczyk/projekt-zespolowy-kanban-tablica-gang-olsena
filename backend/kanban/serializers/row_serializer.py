from rest_framework import serializers
from kanban.models import Row
from kanban.serializers.card_serializer import CardSerializer



class RowSerializer(serializers.ModelSerializer):
    card_data = CardSerializer(source='card_row', many=True, read_only=True)
    class Meta:
        model = Row
        exclude = ('deleted_at',)