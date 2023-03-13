import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card, Row
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.serializers.row_serializer import RowSerializer
from kanban.serializers.pseudo_serialize_all import pseudo_serializer_all
import logging
logger = logging.getLogger(__name__)



class BoardViewSet(viewsets.ViewSet):
    def update_board(self, request, pk=None):
        data = request.data.copy()
        if Board.objects.all().count() == 0:
            index = int(data.get('index', 0))
        else:
            index = int(data.get('index', 1))
        board_instance = None
        if pk:
            board_instance = Board.objects.get_by_pk(pk=pk)
            index = board_instance.index

        data['index'] = index
        serializer = BoardSerializer(data=data, instance=board_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if not board_instance:
            is_success, message = serializer.instance.move(index)

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
                message="Kolumna została {}.".format(board_instance and "zaktualizowana" or "dodana"),
                data=pseudo_serializer_all()
            )
        )

    def update_board_card(self, request, pk):
        data = request.data.copy()
        card_id = data.get('id')
        index = int(data.get('index', 0))
        row = data.get('row')
        if row is None:
            row = ((Row.objects.all())[0]).id
        card_instance = None
        if card_id:
            card_instance = Card.objects.get_by_pk(pk=card_id)
            index = card_instance.index

        Board.objects.get_by_pk(pk=pk)
        data['board'] = pk
        data['index'] = index
        data['row'] = row
        serializer = CardSerializer(data=data, instance=card_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        is_success, message = serializer.instance.move(index, pk, row)

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
                message="Zadanie zostało {}.".format(card_instance and "zaktualizowane" or "dodane"),
                data=pseudo_serializer_all()
            )
        )

    def get_board(self, request, pk):
        board = Board.objects.get_by_pk(pk=pk)
        return Response(
            dict(
                success=True,
                data=BoardSerializer(board).data
            )
        )

    def get_boards(self, request):
         return Response(
            dict(
                success=True,
                data=pseudo_serializer_all()
            )
        )

    def get_board_cards(self, request, pk):
        cards = Card.objects.filter(board_id=pk)

        return Response(
            dict(
                success=True,
                data=CardSerializer(cards, many=True).data
            )
        )

    def move_board(self, request, pk):
        board = Board.objects.get_by_pk(pk=pk)

        is_success, message = board.move(request.data.get('index', board.index), board.index)

        if not is_success:
            return Response(
                dict(
                    success=is_success,
                    data=pseudo_serializer_all(),
                    message=message
                )
            )

        return Response(
            dict(
                success=True,
                data=pseudo_serializer_all(),
            )
        )

    def delete_board(self, request, pk):
        board = Board.objects.get_by_pk(pk=pk, raise_exception=True)

        if board.is_static:
            return Response(
                dict(
                    success=False,
                    message="Nie możesz usunąć tej tablicy."
                )
            )

        board.deleted_at = datetime.datetime.now()
        board.save()

        boards = Board.objects.filter(
            index__gte=board.index,
            deleted_at__isnull=True
        ).order_by('index')

        changed_index = board.index
        for board in boards:
            board.index = changed_index
            board.save()
            changed_index += 1

        return Response(
            dict(
                success=True,
                message="Kolumna została usunięta.",
                data=pseudo_serializer_all(),
            )
        )
