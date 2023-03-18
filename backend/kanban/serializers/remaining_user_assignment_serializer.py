from rest_framework import serializers
from kanban.models import Card, Parameter, Board, User
from user.serializers import UserSerializer


class RemainingSerializer(serializers.ModelSerializer):
    number_of_assigments = serializers.SerializerMethodField()
    remaining_assigments = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','username','number_of_assigments','remaining_assigments']
    @staticmethod
    def get_number_of_assigments(obj):
        return Card.objects.filter(user=obj).count()
    @staticmethod
    def get_remaining_assigments(obj):
        limit=2
    #     # # limit = Parameter.objects.get_by_pk(pk=0)
    #     # cards = CardSerializer(Card.objects.all(), many=True).data
    #     # occurences=Card.objects.filter(user_data=obj).count()
    #     # return limit-occurences
        return limit - obj.number_of_assigments