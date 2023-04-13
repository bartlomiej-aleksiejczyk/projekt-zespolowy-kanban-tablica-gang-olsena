from django.urls import path
from kanban.views.board_view import BoardViewSet
from kanban.views.card_view import CardViewSet
from kanban.views.row_view import RowViewSet
from kanban.views.card_move_view import TimelineViewSet
from kanban.views.parameter_view import ParameterViewSet

single_board_viewset = BoardViewSet.as_view(
    dict(
        get='get_board',
        post='update_board',
        delete='delete_board'
    )
)

board_viewset = BoardViewSet.as_view(
    dict(
        post='update_board',
        get='get_boards'
    )
)

board_move_viewset = BoardViewSet.as_view(
    dict(
        post='move_board'
    )
)

card_move_viewset = CardViewSet.as_view(
    dict(
        post='move_card'
    )
)

single_card_viewset = CardViewSet.as_view(
    dict(
        get='get_card',
        post='update_card',
        delete='delete_card'
    )
)

board_card_viewset = BoardViewSet.as_view(
    dict(
        post='update_board_card',
        get='get_board_cards'
    )
)
single_row_viewset = RowViewSet.as_view(
    dict(
        post='update_row',
        delete='delete_row'
    )
)
row_viewset = RowViewSet.as_view(
    dict(
        post='update_row'
    )
)
parameter_limit_viewset = ParameterViewSet.as_view(
    dict(
        get='get_remaining_user_assignment',
    )
)
parameter_viewset = ParameterViewSet.as_view(
    dict(
        get='get_parameter',
        post='update_parameter',
    )
)

card_item_viewset = BoardViewSet.as_view(
    dict(
        post='update_card_item'
    )
)

single_card_item_viewset = CardViewSet.as_view(
    dict(
        post='update_card_item',
        get='get_card_item',
        delete='delete_card_item'
    )
)

user_board_viewset = CardViewSet.as_view(
    dict(
        post='add_user_card'
    )
)
timeline_viewset = TimelineViewSet.as_view(
    dict(
        get='get_timeline',
    )
)

urlpatterns = [
    # board
    path('board/', board_viewset),
    path('board/<int:pk>/', single_board_viewset),
    path('board/<int:pk>/move/', board_move_viewset),

    # card
    path('card/<int:pk>/', single_card_viewset),
    path('card/<int:pk>/', single_card_viewset),
    path('card/<int:pk>/move/', card_move_viewset),
    path('board/<int:pk>/card/', board_card_viewset),
    path('card/<int:pk>/item/', card_item_viewset),
    path('card/item/<int:pk>/', single_card_item_viewset),
    path('card/<int:pk>/users/', user_board_viewset),

    # row
    path('row/<int:pk>/', single_row_viewset),
    path('row/', row_viewset),
    path('limit/', parameter_limit_viewset),
    path('parameter/<int:pk>/', parameter_viewset),

    # timeline
    path('timeline/', timeline_viewset),
]
