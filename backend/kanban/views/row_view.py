import datetime
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from kanban.models import Board, Row, Card
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.row_serializer import RowSerializer
from kanban.views.helper import remaining_helper


class RowViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)


    def update_row(self, request, pk=None):
        data = request.data.copy()

        row_instance = None
        if pk:
            row_instance = Row.objects.get_by_pk(pk=pk)

        serializer = RowSerializer(data=data, instance=row_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                success=True,
                message="Rząd został {}.".format(row_instance and "zaktualizowany" or "dodany"),
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )
    def get_row(self, request, pk):
        row = Row.objects.get_by_pk(pk=pk)
        print(row)
        return Response(
            dict(
                success=True,
                data=RowSerializer(row).data
            )
        )

    def get_rows(self, request):
        return Response(
            dict(
                success=True,
                data=RowSerializer(Row.objects.all(), many=True).data
            )
        )

    def delete_row(self, request, pk):
        row = Row.objects.get_by_pk(pk=pk, raise_exception=True)
        cards = Card.objects.filter(row_id=pk)

        row.deleted_at = datetime.datetime.now()
        row.save()
        for card in cards:
            card.deleted_at = datetime.datetime.now()
            card.save()

        return Response(
            dict(
                success=True,
                message="Rząd został usunięty.",
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper()
            )
        )
