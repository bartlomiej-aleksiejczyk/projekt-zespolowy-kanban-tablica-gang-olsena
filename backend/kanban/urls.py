from django.urls import path
from kanban.views.board_view import BoardViewSet

board_viewset = BoardViewSet.as_view(
	dict(
		post='create',
		get='get_all'
	)
)

single_board_card_viewset = BoardViewSet.as_view(
	dict(
		post='create_card',
		get='get_cards',
	)
)


urlpatterns = [
    path('board/', board_viewset),
	path('board/<int:pk>/cards/', single_board_card_viewset)
]