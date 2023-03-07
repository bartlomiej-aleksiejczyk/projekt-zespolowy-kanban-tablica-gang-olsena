import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer


class BoardViewSet(viewsets.ViewSet):

    def update_board(self, request):# usunąłem pk z końca bo zapytania nie były ła
        data = request.data.copy()
        board_id = data.get('id')
        index = int(data.get('index', 1))

        board_instance = None
        if board_id:
            board_instance = Board.objects.get_by_pk(pk=board_id)
            index = board_instance.index

        data['index'] = index
        serializer = BoardSerializer(data=data, instance=board_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
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
                sucess=True,
                data=BoardSerializer(
                    Board.objects.get_by_pk(pk=serializer.instance.id)
                ).data
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
                data=serializer.data
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
        boards = Board.objects.all()

        return Response(
            dict(
                success=True,
                data=BoardSerializer(boards, many=True).data
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
                    message=message
                )
            )

        return Response(
            dict(
                success=True,
                data=BoardSerializer(
                    Board.objects.all(),
                    many=True
                ).data
            )
        )

    def delete_board(self, request, pk):
        board = Board.objects.get_by_pk(pk=pk)
        board.deleted_at = datetime.datetime.now()
        board.save()

        is_success, message = board.move(board.index, board.index)

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
                data=BoardSerializer(
                    Board.objects.all(),
                    many=True
                ).data
            )
        )
