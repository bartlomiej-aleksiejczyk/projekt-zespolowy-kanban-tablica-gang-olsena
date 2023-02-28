import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.card_serializer import CardSerializer


class CardViewSet(viewsets.ViewSet):
    def create_card(self, request, pk):
        data = request.data.copy()
        index = request.data.get('index', 0)

        Board.objects.get_by_pk(pk=pk)
        data['board'] = pk
        data['index'] = index
        serializer = CardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        serializer.instance.move(index, pk)

        return Response(
            dict(
                success=True,
                data=serializer.data
            )
        )

    def get_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk)

        return Response(
            dict(
                success=True,
                data=CardSerializer(card).data
            )
        )

    def move_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk)
        card.move(request.data.get('index', card.index), request.data.get('board', card.board_id), card.index,
                  card.board_id)

        return Response(
            dict(
                success=True,
                data=CardSerializer(
                    Card.objects.filter(board_id=card.board_id),
                    many=True
                ).data
            )
        )

    def delete_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk)
        card.deleted_at = datetime.datetime.now()
        card.save()
        card.move(card.index, card.board_id, card.index, card.board_id)

        return Response(
            dict(
                success=True,
                data=CardSerializer(
                    Card.objects.filter(board_id=card.board_id),
                    many=True
                ).data
            )
        )
