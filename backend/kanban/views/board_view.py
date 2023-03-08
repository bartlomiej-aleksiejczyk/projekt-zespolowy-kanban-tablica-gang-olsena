import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer


class BoardViewSet(viewsets.ViewSet):

    def update_board(self, request, pk=None):
        data = request.data.copy()
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
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )

    def update_board_card(self, request, pk):
        data = request.data.copy()
        card_id = data.get('id')
        index = int(data.get('index', 0))

        card_instance = None
        if card_id:
            card_instance = Card.objects.get_by_pk(pk=card_id)
            index = card_instance.index

        Board.objects.get_by_pk(pk=pk)
        data['board'] = pk
        data['index'] = index
        serializer = CardSerializer(data=data, instance=card_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        is_success, message = serializer.instance.move(index, pk)

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
                data=BoardSerializer(Board.objects.all(), many=True).data
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
                data=BoardSerializer(Board.objects.all(), many=True).data
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
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    message=message
                )
            )

        return Response(
            dict(
                success=True,
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )

    def delete_board(self, request, pk):
        board = Board.objects.get_by_pk(pk=pk)

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
                data=BoardSerializer(Board.objects.all(), many=True).data,
            )
        )
