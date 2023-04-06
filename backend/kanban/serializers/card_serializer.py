import datetime

from rest_framework import serializers
from kanban.models import Card, CardItem, Board, CardMoveTimeline
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
    children_done_percentage = serializers.SerializerMethodField()
    restricted_boards_data = BoardSerializerPartial(source='restricted_boards', many=True, read_only=True)
    parent_name = serializers.SerializerMethodField()
    move_to_board_at = serializers.SerializerMethodField()

    class Meta:
        model = Card
        exclude = ('deleted_at',)

    @staticmethod
    def get_move_to_board_at(obj):
        last_card_move = CardMoveTimeline.objects.filter(
            card=obj
        ).exclude(board=obj.board).order_by('-id').first()

        if last_card_move:
            return last_card_move.created_at

        return datetime.datetime.now()

    @staticmethod
    def get_subtask_done_percentage(obj):
        try:
            result = int(obj.card_item.filter(is_done=True).count() / obj.card_item.count() * 100)
            return result
        except:
            return 0
    @staticmethod
    def get_children_done_percentage(obj):
        try:
            result = int(
                    Card.objects.filter(
                        parent_card=obj.id,
                        is_card_finished=True
                    ).count()
                    / Card.objects.filter(
                        parent_card=obj.id
                    ).count() * 100
                )
            return result
        except:
            return 0

    @staticmethod
    def get_parent_name(obj):
        return Card.objects.filter(id=obj.parent_card_id).values_list('description', flat=True)
