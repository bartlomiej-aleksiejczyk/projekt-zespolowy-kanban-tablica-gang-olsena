import datetime

from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Max
from kanban.models import Board, Card
from kanban.serializers.card_serializer import CardSerializer


class CardViewSet(viewsets.ViewSet):
    #Jak coś to w zapytaniu "pk" odnosi się do pk boarda
    def create_card(self, request, pk):
        data = request.data.copy()
        index = data.get('index', 0)
        #tutaj nie mam pojęcia czemu pk musi być w po niższej linijsce a nie np. "n_pk", ciekawa sprawa w każdym razie -B
        pk = int(data.get('pk'))
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
        data = request.data.copy()
        pk = data.get('pk')
        card = Card.objects.get_by_pk(pk=pk)

        return Response(
            dict(
                success=True,
                data=CardSerializer(card).data
            )
        )

    def move_card(self, request, pk):
        data = request.data.copy()
        pk=data.get("pk")
        card = Card.objects.get_by_pk(pk=pk)
        card.move(data.get('index', card.index), data.get('board', card.board_id), card.index,
                  card.board_id)

        return Response(
            dict(
                #Nie działało mi to zakomentowalem xD
                success=True#,
                # data=CardSerializer(
                #     Card.objects.filter(board_id=card.board_id),
                #     many=True
                # ).data
            )
        )
    def find_highest_index_card(self, request,pk):
        return Response(
            dict(
                success=True,
                data=CardSerializer(Card.objects.order_by('-index')[:1].get(),
                                    #tutaj też nic nie dziala jak many jest True
                    many=False
                ).data
            )
        )

    def delete_card(self, request, pk):
        data = request.data.copy()
        pk = data.get('pk')
        card = Card.objects.get_by_pk(pk=pk)
        card.deleted_at = datetime.datetime.now()
        card.save()
        # Nie ogarniałem co poniższe robi więc wyczyściłem xD
        #card.move(card.index, card.board_id, card.index, card.board_id)

        return Response(
            dict(
                success=True,
            )
        )
