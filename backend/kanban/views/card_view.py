import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card
from kanban.serializers.card_serializer import CardSerializer


class CardViewSet(viewsets.ViewSet):
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

        is_success, message = card.move(
            request.data.get('index', card.index),
            request.data.get('board', card.board_id),
            card.index,
            card.board_id
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
                test=Card.objects.count() - 1,
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

        is_success, message = card.move(card.index, card.board_id, card.index, card.board_id)

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
                data=CardSerializer(
                    Card.objects.filter(board_id=card.board_id),
                    many=True
                ).data
            )
        )
