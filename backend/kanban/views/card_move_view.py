import datetime
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from kanban.models import Board, Card, CardItem, CardMoveTimeline
from kanban.serializers.card_move_timeline_serializer import CardMoveSerializer
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer, CardItemSerializer
from kanban.views.helper import remaining_helper


class TimelineViewSet(viewsets.ViewSet):
    # permission_classes = (IsAuthenticated,)

    def get_timeline(self, request):
        return Response(
            dict(
                success=True,
                data=CardMoveSerializer(CardMoveTimeline.objects.all(), many=True).data,
            )
        )
