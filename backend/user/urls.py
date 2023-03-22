from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from user.views import UserViewSet, MyTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static
from django import forms
user_viewset = UserViewSet.as_view(
    dict(
        get='get',
        post='create_user'
    )
)
user_img_viewset = UserViewSet.as_view(
    dict(
        get='get_image',
        post='update_user'
    )
)
single_user_viewset = UserViewSet.as_view(
    dict(
        get='get_single_user'
    )
)

urlpatterns = [
    path('user/', user_viewset, name='user_viewset'),
    path('user/<int:pk>/image/', user_img_viewset, name='user_img_viewset'),
    path('user/<int:pk>/', single_user_viewset, name='single_user_viewset'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
