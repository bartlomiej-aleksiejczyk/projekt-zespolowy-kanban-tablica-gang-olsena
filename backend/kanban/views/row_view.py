import datetime
from rest_framework import viewsets
from rest_framework.response import Response
from kanban.models import Board, Card, Row
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.serializers.row_serializer import RowSerializer
from kanban.serializers.pseudo_serialize_all import pseudo_serializer_all
import json
import logging
import copy

logger = logging.getLogger(__name__)


class RowViewSet(viewsets.ViewSet):

    def update_row(self, request, pk=None):
        data = request.data.copy()
        index = int(data.get('index', 1))

        row_instance = None
        if pk:
            row_instance = Row.objects.get_by_pk(pk=pk)
            index = row_instance.index

        data['index'] = index
        serializer = RowSerializer(data=data, instance=row_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if not row_instance:
            is_success, message = True, "tu wcześniej była serializer.instance.move(index)"

            if not is_success:
                return Response(
                    dict(
                        success=is_success,
                        message=message
                    )
                )

        return Response(
            dict(
                success=True,
                message="Rząd został {}.".format(row_instance and "zaktualizowana" or "dodana"),
                data=pseudo_serializer_all()
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

    def get_board_row_cards(self, request):
        boards = (BoardSerializer(Board.objects.all(), many=True)).data
        rows = (RowSerializer(Row.objects.all(), many=True)).data
        cards = (CardSerializer(Card.objects.all(), many=True)).data
        for board in boards:
            # Use deepcopy when you are working with nested objects. copy won´t do the trick there!
            rows_cp=copy.deepcopy(rows)
            board['row_data'] = rows_cp
            del rows_cp
            for row in board['row_data']:
                card_board_row = []
                for card in cards:
                    if (card['row'] == row['id']) & (card['board'] == board['id']):
                        card_board_row.append(card)
                row['card_data'] = card_board_row
                del card_board_row
        return Response(
            dict(
                success=True,
                data_rows=boards,
            )
        )

    def delete_row(self, request, pk):
        row = Row.objects.get_by_pk(pk=pk, raise_exception=True)

        row.deleted_at = datetime.datetime.now()
        row.save()

        rows = Row.objects.filter(
            index__gte=row.index,
            deleted_at__isnull=True
        ).order_by('index')

        changed_index = row.index
        for row in rows:
            row.index = changed_index
            row.save()
            changed_index += 1

        return Response(
            dict(
                success=True,
                message="Rząd został usunięty.",
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )
