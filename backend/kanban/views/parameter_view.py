import datetime
from itertools import chain
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from kanban.models import Board, Row, Parameter, Card, User
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.row_serializer import RowSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.serializers.parameter_serializer import ParameterSerializer
from kanban.serializers.remaining_user_assignment_serializer import RemainingSerializer


class ParameterViewSet(viewsets.ViewSet):
    # odkomentować po testach
    # permission_classes = (IsAuthenticated,)

    def update_parameter(self, request, pk=None):
        data = request.data.copy()
        parameter_instance = None
        if pk:
            parameter_instance = Parameter.objects.get_by_pk(pk=pk)

        serializer = ParameterSerializer(data=data, instance=parameter_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                success=True,
                message="Parametr został {}.".format(parameter_instance and "zaktualizowany" or "dodany"),
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )

    def get_remaining_user_assignment(self, request):
        occurrences = RemainingSerializer(User.objects.all(), many=True).data
        result = RemainingSerializer(User.objects.none(), many=True).data
        for user in occurrences:
            for number in range(user['remaining_assignments']):
                result.append(user)
        print(type(result))
        return Response(
            dict(
                success=True,
                data=result
            )
        )
