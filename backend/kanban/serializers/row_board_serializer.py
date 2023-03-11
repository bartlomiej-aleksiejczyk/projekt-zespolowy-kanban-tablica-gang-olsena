from rest_framework import serializers
from kanban.models import Card
from kanban.models import Row
from kanban.serializers.card_serializer import CardSerializer


class RowBoardSerializer(serializers.ModelSerializer):

    CardSerializer(source='card_row card_board', many=True, read_only=True)
    class Meta:
        model = Row
        exclude = ('deleted_at',)