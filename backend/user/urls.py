from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from user.views import UserViewSet, MyTokenObtainPairView

user_viewset = UserViewSet.as_view(
    dict(
        get='get',
        post='create_user'
    )
)
user_img_viewset = UserViewSet.as_view(
    dict(
        post='update_user'
    )
)

urlpatterns = [
    path('user/', user_viewset, name='user_viewset'),
    path('user/<int:pk>/image/', user_img_viewset, name='user_img_viewset'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
