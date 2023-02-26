from rest_framework import serializers
from kanban.models import Board
from kanban.serializers.card_serializer import CardSerializer


class BoardSerializer(serializers.ModelSerializer):
    card_data = CardSerializer(source='card_board', many=True)

    class Meta:
        model = Board
        exclude = ('deleted_at',)