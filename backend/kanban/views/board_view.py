import datetime

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from kanban.models import Board, Card, Row, CardItem
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.views.helper import remaining_helper


class BoardViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

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
                message=(board_instance and "apiColumnUpdated" or "apiColumnAdded"),
                data=BoardSerializer(Board.objects.all(), many=True).data

            )
        )
#Dla 4.04.2023 metoda ta musi mieć dołączone carditems, inaczej uznaje że wszystkie carditems zostały usunięte
    def update_board_card(self, request, pk):
        data = request.data.copy()
        card_id = data.get('id')
        board_new = data.get('board')
        index = int(data.get('index', 0))
        row_id = data.get('row')
        parent = data.get('parent_card')
        restricted_boards = data.get('restricted_boards', [])

        restricted_boards_old =list(Card.objects.filter(id=card_id).values_list('restricted_boards',flat=True))[1:]
        children = Card.objects.filter(parent_card=card_id)

        card_instance = None
        first_board_id = Board.objects.filter(index=0).first()

        if first_board_id:
            first_board_id = first_board_id.id

        if first_board_id in restricted_boards:
            return Response(
                dict(
                    success=False,
                    message="apiColumnOnRestrictedListIsFirstError",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=remaining_helper(),
                    data2=CardSerializer(Card.objects.all(), many=True).data,
                    data3=restricted_boards_old
                )
            )
        if board_new in restricted_boards:
            return Response(
                dict(
                    success=False,
                    message="apiColumnOnRestrictedListError",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=remaining_helper(),
                    data2=CardSerializer(Card.objects.all(), many=True).data,
                    data3=restricted_boards_old

                )
            )
        if pk in restricted_boards:
            return Response(
                dict(
                    success=False,
                    message="apiColumnOnRestrictedListIsCurrentPositionError",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=remaining_helper(),
                    data2=CardSerializer(Card.objects.all(), many=True).data,
                    data3=restricted_boards_old

                )
            )

        if card_id:
            card_instance = Card.objects.get_by_pk(pk=card_id)
            index = card_instance.index

            if row_id is None:
                row_id = card_instance.row_id
            if parent ==card_id:
                return Response(
                    dict(
                        success=False,
                        message="apiBoardCardSelfParentError",
                        data=BoardSerializer(Board.objects.all(), many=True).data,
                        data1=remaining_helper(),
                        data2=CardSerializer(Card.objects.all(), many=True).data,
                        data3=restricted_boards_old

                    )
                )
            if parent and children:
                return Response(
                    dict(
                        success=False,
                        message="apiBoardCardParentToParentError",
                        data=BoardSerializer(Board.objects.all(), many=True).data,
                        data1=remaining_helper(),
                        data2=CardSerializer(Card.objects.all(), many=True).data,
                        data3=restricted_boards_old

                    )
                )

        if row_id is None:
            row_id = Row.objects.first().id
        data['board'] = pk
        data['index'] = index
        data['row'] = row_id
        serializer = CardSerializer(data=data, instance=card_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        items = data.get('items', [])

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
                message=(card_instance and "apiBoardCardUpdated" or "apiBoardCardAdded"),
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper(),
                data2=CardSerializer(Card.objects.all(), many=True).data


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
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=CardSerializer(Card.objects.all(), many=True).data
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
        cards_move = Card.objects.filter(board_id=pk)
        cards = (Card.objects.filter(restricted_boards__in=[pk]))
        for card in cards:
            card.restricted_boards.remove(pk)
            card.save()
        if board.is_static:
            return Response(
                dict(
                    success=False,
                    message="apiColumnDeleteError"
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
        for card in cards_move:
            card.board = first_board
            card.row = first_row
            card.index = 0
            card.save()
            card.move(0, first_board.id, first_row.id)
        changed_index = board.index
        for board in boards:
            board.index = changed_index
            board.save()
            changed_index += 1

        return Response(
            dict(
                success=True,
                message="apiColumnDelete",
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper()
            )
        )
