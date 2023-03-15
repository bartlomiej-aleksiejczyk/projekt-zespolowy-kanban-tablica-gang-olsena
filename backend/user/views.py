from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from user.serializers import UserSerializer, RegisterSerializer


class UserViewSet(viewsets.ViewSet):
    def create_user(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        refresh = RefreshToken.for_user(serializer.instance)

        return Response(
            dict(
                success=True,
                data=UserSerializer(serializer.instance).data,
                refresh=str(refresh),
                access=str(refresh.access_token)
            )
        )
