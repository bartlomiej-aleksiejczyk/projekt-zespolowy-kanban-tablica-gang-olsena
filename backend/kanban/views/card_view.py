import datetime
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from kanban.models import Board, Card, CardItem
from kanban.serializers.board_serializer import BoardSerializer
from kanban.views.helper import remaining_helper
from kanban.serializers.card_serializer import CardSerializer, CardItemSerializer


class CardViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

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
        restricted_boards=list(Card.objects.filter(id=pk).values_list('restricted_boards',flat=True))
        board_new = request.data.get('board')

        if board_new in restricted_boards:
            return Response(
                dict(
                    success=False,
                    message="apiColumnOnBlacklist",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=remaining_helper(),
                    data2=CardSerializer(Card.objects.all(), many=True).data

                )
            )
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

    def update_card(self, request, pk):
        data = request.data.copy()
        card_instance = Card.objects.get_by_pk(pk=pk)

        serializer = CardSerializer(data=data, instance=card_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                success=True,
                message="apiCardUpdated",
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper(),
                data2 = CardSerializer(Card.objects.all(), many=True).data
        )
        )

    def delete_card(self, request, pk):
        card = Card.objects.get_by_pk(pk=pk, raise_exception=True)
        children = Card.objects.filter(parent_card=pk)
        for child in children:
            child.parent_card = None
            child.save()
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
                message="apiCardDeleted",
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper(),
                data2=CardSerializer(Card.objects.all(), many=True).data
            )
        )

    def update_card_item(self, request, pk=None):
        data = request.data.copy()

        card_item_instance = None
        if pk:
            card_item_instance = CardItem.objects.get_by_pk(pk=pk)

        serializer = CardItemSerializer(data=data, instance=card_item_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                success=True,
                message=(card_item_instance if "apiCardItemUpdated" else "apiCardItemAdded"),
                data=CardItemSerializer(CardItem.objects.all(), many=True).data
            )
        )

    def delete_card_item(self, request, pk):
        card_item = CardItem.objects.get_by_pk(pk=pk, raise_exception=True)
        card_item.deleted_at = datetime.datetime.now()
        card_item.save()


        return Response(
            dict(
                success=True,
                message="apiCardItemDeleted",
                data=CardItemSerializer(CardItem.objects.all(), many=True).data
            )
        )

    def add_user_card(self, request, pk):
        card_instance = Card.objects.get_by_pk(pk=pk)
        new_user = (request.data.get('users'))
        users = CardSerializer(card_instance).data['users']
        if new_user in users:
            return Response(
                dict(
                    success=False,
                    message="apiSameUserAssignmentError",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=remaining_helper()
                )
            )
        data = dict(request.data)
        users.append(new_user)
        data['users'] = users

        serializer = CardSerializer(data=data, instance=card_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            dict(
                success=True,
                message="apiCardUpdated",
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=remaining_helper()
            )
        )
