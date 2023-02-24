from rest_framework import serializers
from kanban.models import Board


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        exclude = ('deleted_at',)