import datetime

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer


class CardViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def get_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk)
        print(card)
        return Response(
            dict(
                success=True,
                data=CardSerializer(card).data
            )
        )

    def move_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk)

        is_success, message = card.move(
            request.data.get('index', card.index),
            request.data.get('board', card.board_id),
            request.data.get('row', card.row_id),
            card.index,
            card.board_id,
            card.row_id
        )

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
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )

    def delete_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk, raise_exception=True)
        card.deleted_at = datetime.datetime.now()
        card.save()

        cards = Card.objects.filter(
            row_id=card.row_id,
            board_id=card.board_id,
            index__gte=card.index,
            deleted_at__isnull=True
        ).order_by('index')

        changed_index = card.index
        for card in cards:
            card.index = changed_index
            card.save()
            changed_index += 1

        return Response(
            dict(
                success=True,
                message="Zadanie zostało usunięte.",
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )
