import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer


class BoardViewSet(viewsets.ViewSet):

    def create_board(self, request):
        data = request.data.copy()
        index = int(data.get('index', 0))

        data['index'] = index
        serializer = BoardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
#Nie wiem czy dodałem tutaj dobry parmaetr None -B. U MNIE DZIAŁA
        serializer.instance.move(index,None)

        return Response(
            dict(
                sucess=True,
                data=BoardSerializer(
                    Board.objects.get_by_pk(pk=serializer.instance.id)
                ).data
            )
        )

    def get_board(self, request, pk):
        data = request.data.copy()
        id=int(data['id'])
        board = Board.objects.get_by_pk(pk=id)
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
#Funkcja agreguje karty przynależne dla danej tablicy
    def get_board_cards(self, request, pk):
        data = request.data.copy()
        id = int(data['id'])
        cards = Card.objects.filter(board_id=id)

        return Response(
            dict(
                success=True,
                data=CardSerializer(cards, many=True).data
            )
        )

    def move_board(self, request, pk):
        board = Board.objects.get_by_pk(pk=pk)
        board.move(request.data.get('index', board.index), board.index)

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
        board.move(board.index, board.index)

        return Response(
            dict(
                success=True,
                data=BoardSerializer(
                    Board.objects.all(),
                    many=True
                ).data
            )
        )
