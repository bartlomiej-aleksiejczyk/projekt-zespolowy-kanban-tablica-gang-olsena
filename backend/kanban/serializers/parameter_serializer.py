from rest_framework import serializers
from kanban.models import Parameter


class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        exclude = ('deleted_at',)