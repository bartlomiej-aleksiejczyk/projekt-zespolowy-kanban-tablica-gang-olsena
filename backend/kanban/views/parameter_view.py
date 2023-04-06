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
from kanban.views.helper import remaining_helper

class ParameterViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def get_parameter(self, request, pk):
        parameter = Parameter.objects.get_by_pk(pk=pk)
        return Response(
            dict(
                success=True,
                data=ParameterSerializer(parameter).data
            )
        )



    def get_remaining_user_assignment(self, request):
        result=remaining_helper()
        return Response(
            dict(
                success=True,
                data=result
            )
        )
    def update_parameter(self, request, pk=None):
        data = request.data.copy()
        limit = data.get('value')
        parameter_instance = None

        parameter_old = Parameter.objects.get_by_pk(pk=pk)
        bad_response = ParameterSerializer(parameter_old).data
        if pk == 1:
            for assignment in RemainingSerializer(User.objects.all(), many=True).data:
                print(assignment.get('assignments'))
                if limit < assignment.get('assignments'):
                    return Response(
                        dict(
                            success=False,
                            message="apiParameterCurrentLimitLowerThanNumberOfAssignmentsError",
                            data=ParameterSerializer(Parameter.objects.get_by_pk(pk=1)).data
                        )
                    )
        if pk:
            parameter_instance = Parameter.objects.get_by_pk(pk=pk)
            serializer = ParameterSerializer(data=data, instance=parameter_instance, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(
                dict(
                    success=True,
                    message=(parameter_instance and "apiParameterUpdated" or "apiParameterAdded"),
                    data=ParameterSerializer(Parameter.objects.get_by_pk(pk=1)).data,
                    data1=remaining_helper()
                )
            )