from decimal import Decimal

from rest_framework import serializers
from kanban.models import Card, CardItem, Board
from user.serializers import UserSerializer

class BoardSerializerPartial(serializers.ModelSerializer):
    class Meta:
        model = Board
        exclude = ('deleted_at',)
class CardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardItem
        exclude = ('deleted_at',)


class CardChildSerializer(serializers.ModelSerializer):
    subtask_done_percentage = serializers.SerializerMethodField()
    has_items = serializers.SerializerMethodField()
    class Meta:
        model = Card
        exclude = ('deleted_at',)

    @staticmethod
    def get_subtask_done_percentage(obj):
        try:
            return int(obj.card_item.filter(is_done=True).count() / obj.card_item.count() * 100)
        except:
            return 0
    @staticmethod
    def get_has_items(obj):
        return obj.card_item.exists()

class CardSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    users_data = UserSerializer(source='users', many=True, read_only=True)
    item_data = CardItemSerializer(source='card_item', many=True, read_only=True)
    child_data = CardChildSerializer(source='card_parent_card', many=True, read_only=True)
    subtask_done_percentage = serializers.SerializerMethodField()
    restricted_boards_data = BoardSerializerPartial(source='restricted_boards', many=True, read_only=True)
    parent_name = serializers.SerializerMethodField()
    class Meta:
        model = Card
        exclude = ('deleted_at',)

    @staticmethod
    def get_subtask_done_percentage(obj):
        try:
            if Card.objects.filter(parent_card=obj.id).exists():
                print("test")
                result =int(Card.objects.filter(parent_card=obj.id,is_card_completed=True).count() / Card.objects.filter(parent_card=obj.id).count() * 100)
            else:
                result=int(obj.card_item.filter(is_done=True).count() / obj.card_item.count() * 100)
            return result
        except:
            return 0
    @staticmethod
    def get_parent_name(obj):
        try:
            return Card.objects.filter(id=(obj.parent_card).id).values_list('description',flat=True)
        except:
            return []
