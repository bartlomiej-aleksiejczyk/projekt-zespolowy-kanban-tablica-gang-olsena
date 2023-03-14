from rest_framework import serializers
from kanban.models import Board, Row
from kanban.serializers.row_serializer import RowSerializer

class BoardSerializer(serializers.ModelSerializer):
    row_data = serializers.SerializerMethodField()
    is_static = serializers.SerializerMethodField()

    class Meta:
        model = Board
        exclude = ('deleted_at',)

    @staticmethod
    def get_is_static(obj):
        return obj.is_static

    @staticmethod
    def get_row_data(obj):
        rows_data = RowSerializer(Row.objects.all(), many=True).data
        for row_idx, row_data in enumerate(rows_data):
            row_data['card_data'] = [card_data for card_data in row_data['card_data'] if card_data['board'] == obj.id]

        return rows_data