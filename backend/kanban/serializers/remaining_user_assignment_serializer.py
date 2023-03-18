from rest_framework import serializers
from kanban.models import Card, Parameter, Board, User
from user.serializers import UserSerializer
from kanban.serializers.parameter_serializer import ParameterSerializer


class RemainingSerializer(serializers.ModelSerializer):
    remaining_assigments = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'remaining_assignments']

    @staticmethod
    def get_remaining_assigments(obj):
        occurrences = Card.objects.filter(user=obj).count()
        limit = (Parameter.objects.get_by_pk(0)).value
        return limit - occurrences
