import datetime
from rest_framework import viewsets
from rest_framework.response import Response
from kanban.models import Board, Card, Row
from kanban.serializers.board_serializer import BoardSerializer
from kanban.serializers.card_serializer import CardSerializer
from kanban.serializers.row_serializer import RowSerializer
import json
import logging
import copy


def pseudo_serializer_all():
    boards = (BoardSerializer(Board.objects.all(), many=True)).data
    rows = (RowSerializer(Row.objects.all(), many=True)).data
    cards = (CardSerializer(Card.objects.all(), many=True)).data
    for board in boards:
        # Use deepcopy when you are working with nested objects. copy won´t do the trick there!
        rows_cp = copy.deepcopy(rows)
        board['row_data'] = rows_cp
        del rows_cp
        for row in board['row_data']:
            card_board_row = []
            for card in cards:
                if (card['row'] == row['id']) & (card['board'] == board['id']):
                    card_board_row.append(card)
            row['card_data'] = card_board_row
            del card_board_row
    return boards
