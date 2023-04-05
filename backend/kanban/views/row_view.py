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
                message=(row_instance and "apiRowUpdated" or "apiRowAdded"),
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )

    def get_row(self, request, pk):
        row = Row.objects.get_by_pk(pk=pk)
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
        if row.id == Row.objects.all().order_by('id').first().id:
            print("test")
            return Response(
                dict(
                    success=False,
                    message="apiLastRowDeleteError",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=remaining_helper()
                )
            )
        cards = Card.objects.filter(row_id=pk)
        row.deleted_at = datetime.datetime.now()
        row.save()
        first_board = Board.objects.all().order_by('index').first()
        first_row = Row.objects.all().order_by('id').first()
        for card in cards:
            card.board = first_board
            card.row = first_row
            card.index = 0
            card.save()
            card.move(0, first_board.id, first_row.id)
        return Response(
            dict(
                success=True,
                message="apiRowDeleted",
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper()
            )
        )
