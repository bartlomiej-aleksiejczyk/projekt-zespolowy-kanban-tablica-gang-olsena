import datetime

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from kanban.models import Board, Card, Row, CardItem
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.views.helper import remaining_helper


class BoardViewSet(viewsets.ViewSet):
    # permission_classes = (IsAuthenticated,)

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
                data=BoardSerializer(Board.objects.all(), many=True).data

            )
        )

    def update_board_card(self, request, pk):
        data = request.data.copy()
        card_id = data.get('id')
        index = int(data.get('index', 0))
        row_id = data.get('row')

        card_instance = None
        if card_id:
            card_instance = Card.objects.get_by_pk(pk=card_id)
            index = card_instance.index

            if row_id is None:
                row_id = card_instance.row_id

        if row_id is None:
            row_id = Row.objects.first().id

        Board.objects.get_by_pk(pk=pk)
        data['board'] = pk
        data['index'] = index
        data['row'] = row_id
        serializer = CardSerializer(data=data, instance=card_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        items = data.get('items', [])
        # ten bug, który nas straszyl w czwartek rano został rozwiązany tak, że zneutralizowałem warunek "if items:"
        # A błąd byl taki, że aby usunąć podzadania poniższa pętla musi przebiec, tylko warunek jest tak skonstruowany, że
        # w przypadku usunięcia wszystkiego pętla się nie załącza bo items jest None, czyli warunek nie spełniony
        # więc działało to tylko dla niepustego rezultatu usunięcia
        # if items:
        CardItem.objects.filter(card_id=card_id).exclude(id__in=[item['id'] for item in items if 'id' in item]).update(
            deleted_at=datetime.datetime.now()
        )
        for item in items:
            CardItem.objects.update_or_create(
                id=item.get('id', None),
                defaults=dict(
                    card_id=item.get('card', card_id),
                    name=item.get('name', ""),
                    is_done=item.get('is_done', False)
                )
            )
        # tu był koniec warunku

        is_success, message = serializer.instance.move(index, pk, row_id)

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
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper()

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
        board = Board.objects.get_by_pk(pk=pk, raise_exception=True)
        cards = Card.objects.filter(board_id=pk)
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
        first_board = Board.objects.all().order_by('index').first()
        first_row = Row.objects.first()
        for card in cards:
            card.board = first_board
            card.row = first_row
            card.index = 0
            card.save()
            card.move(0, first_board, first_row)
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
                data1=remaining_helper()
            )
        )
