from decimal import Decimal

from rest_framework import serializers
from kanban.models import Card, CardItem
from user.serializers import UserSerializer


class CardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardItem
        exclude = ('deleted_at',)


class CardSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    users_data = UserSerializer(source='users', many=True, read_only=True)
    item_data = CardItemSerializer(source='card_item', many=True, read_only=True)
    subtask_done_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Card
        exclude = ('deleted_at',)

    @staticmethod
    def get_subtask_done_percentage(obj):
        try:
            return int(obj.card_item.filter(is_done=True).count() / obj.card_item.count() * 100)
        except:
            return 0
