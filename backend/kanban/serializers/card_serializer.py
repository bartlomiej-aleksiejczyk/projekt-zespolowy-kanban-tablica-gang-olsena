from rest_framework import serializers
from kanban.models import Card, CardItem
from user.serializers import UserSerializer

class CardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardItem
        exclude = ('deleted_at',)

class CardSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    item_data = CardItemSerializer(source='card_item', many=True, read_only=True)

    class Meta:
        model = Card
        exclude = ('deleted_at',)