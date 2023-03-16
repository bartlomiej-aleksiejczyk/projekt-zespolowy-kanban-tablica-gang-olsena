from rest_framework import serializers
from kanban.models import Card
from user.serializers import UserSerializer


class CardSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Card
        exclude = ('deleted_at',)