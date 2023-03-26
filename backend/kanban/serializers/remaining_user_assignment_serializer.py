from rest_framework import serializers
from kanban.models import Card, Parameter, Board, User
from user.serializers import UserSerializer
from kanban.serializers.parameter_serializer import ParameterSerializer


class RemainingSerializer(serializers.ModelSerializer):
    remaining_assignments = serializers.SerializerMethodField()
    assignments = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'remaining_assignments', 'assignments']

    @staticmethod
    def get_remaining_assignments(obj):
        occurrences = Card.objects.filter(users=obj, deleted_at__isnull=True).count()
        limit = (Parameter.objects.get_by_pk(1)).value
        return limit - occurrences
    @staticmethod
    def get_assignments(obj):
        return Card.objects.filter(users=obj, deleted_at__isnull=True).count()
