from django.urls import path
from kanban.views.board_view import BoardViewSet
from kanban.views.card_view import CardViewSet
from kanban.views.row_view import RowViewSet


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
        delete='delete_card'
    )
)

board_card_viewset = BoardViewSet.as_view(
    dict(
        post='update_board_card',
        get='get_board_cards'
    )
)
row_card_viewset = RowViewSet.as_view(
    dict(
        post='update_row_card',
    )
)
single_row_viewset = RowViewSet.as_view(
    dict(
        post='update_row',
        get='get_rows'
    )
)
row_viewset = RowViewSet.as_view(
    dict(
        post='update_row',
        get='get_rows'
    )
)

urlpatterns = [
    path('board/', board_viewset),
    path('board/<int:pk>/', single_board_viewset),
    path('board/<int:pk>/move/', board_move_viewset),
    path('card/<int:pk>/', single_card_viewset),
    path('card/<int:pk>/move/', card_move_viewset),
    path('board/<int:pk>/card/', board_card_viewset),
    path('board/row/<int:pk>/card/', row_card_viewset),
    path('board/row/', single_row_viewset),
    path('board/row/<int:pk>/', row_viewset)

]
