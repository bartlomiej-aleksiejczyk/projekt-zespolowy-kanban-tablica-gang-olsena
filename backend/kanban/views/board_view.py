from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer


class BoardViewSet(viewsets.ViewSet):

    def create(self, request):
        data = request.data.copy()

        serializer = BoardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                sucess=True,
                data=serializer.data
            )
        )

    def get_all(self, request):
        boards = Board.objects.filter(deleted_at__isnull=True)

        return Response(
            dict(
                success=True,
                data=BoardSerializer(boards, many=True).data
            )
        )

    def create_card(self, request, pk):
        data = request.data.copy()
        board = Board.objects.get_by_pk(pk=pk)

        data['board'] = board.id
        serializer = CardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                success=True,
                data=serializer.data
            )
        )

    def get_cards(self, request, pk):
        cards = Card.objects.filter(board_id=pk, deleted_at__isnull=True)

        return Response(
            dict(
                success=True,
                data=CardSerializer(cards, many=True).data
            )
        )
