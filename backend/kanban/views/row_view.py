import datetime

from rest_framework import viewsets
from rest_framework.response import Response

from kanban.models import Board, Card, Row
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.serializers.row_serializer import RowSerializer



class RowViewSet(viewsets.ViewSet):

    def update_row(self, request, pk=None):
        data = request.data.copy()
        index = int(data.get('index', 1))

        row_instance = None
        if pk:
            row_instance = Row.objects.get_by_pk(pk=pk)
            index = row_instance.index

        data['index'] = index
        serializer = RowSerializer(data=data, instance=row_instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if not row_instance:
            is_success, message = True, "tu wcześniej była serializer.instance.move(index)"

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
                message="Rząd został {}.".format(row_instance and "zaktualizowana" or "dodana"),
                data=RowSerializer(Row.objects.all(), many=True).data
            )
        )

    def update_row_card(self, request, pk):
        data = request.data.copy()
        card_id = data.get('id')
        index = int(data.get('index', 0))

        card_instance = None
        if card_id:
            card_instance = Card.objects.get_by_pk(pk=card_id)
            index = card_instance.index

        Row.objects.get_by_pk(pk=pk)
        data['row'] = pk
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
                message="Zadanie zostało {}.".format(card_instance and "zaktualizowane" or "dodane"),
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )

    def get_row(self, request, pk):
        row = Row.objects.get_by_pk(pk=pk)

        return Response(
            dict(
                success=True,
                data=RowSerializer(row).data
            )
        )

    def get_rows(self, request):
        return Response(
            dict(
                success=True,
                data=RowSerializer(Row.objects.all(), many=True).data
            )
        )

    def get_row_cards(self, request, pk):
        cards = Card.objects.filter(row_id=pk)

        return Response(
            dict(
                success=True,
                data=CardSerializer(cards, many=True).data
            )
        )

    def delete_row(self, request, pk):
        row = Row.objects.get_by_pk(pk=pk, raise_exception=True)

        row.deleted_at = datetime.datetime.now()
        board.save()

        rows = Row.objects.filter(
            index__gte=row.index,
            deleted_at__isnull=True
        ).order_by('index')

        changed_index = row.index
        for row in rows:
            row.index = changed_index
            row.save()
            changed_index += 1

        return Response(
            dict(
                success=True,
                message="Rząd został usunięty.",
                data=BoardSerializer(Board.objects.all(), many=True).data
            )
        )
