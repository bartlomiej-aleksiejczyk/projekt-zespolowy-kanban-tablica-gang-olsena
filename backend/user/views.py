from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from kanban.serializers.board_serializer import BoardSerializer
from kanban.models import Board, User
from user.serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer
from kanban.views.parameter_view import ParameterViewSet
from kanban.views.helper import remaining_helper
from kanban.forms import AvatarUpload
from django.core.files.storage import FileSystemStorage

class UserViewSet(viewsets.ViewSet):
    def get(self, request):
        return Response(
            dict(
                success=True,
                data=UserSerializer(User.objects.all(), many=True).data
            )
        )

    def get_image(self, request, pk):
        user = User.objects.get_by_pk(pk=pk)
        return Response(
            dict(
                success=True,
                data=user.image
            )
        )

    def get_single_user(self, request, pk):
        user = User.objects.get_by_pk(pk=pk)
        return Response(
            dict(
                success=True,
                data=UserSerializer(user).data
            )
        )

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

    def update_user(self, request, pk):
        user_instance = None
        if pk:
            user_instance = User.objects.get_by_pk(pk=pk)
        if request.FILES['avatar']:
            plik=request.FILES['avatar']
            fs = FileSystemStorage()
            filename = fs.save(plik.name, plik)
            link="http://localhost:8000"
            uploaded_file_url = fs.url(filename)
            link+=uploaded_file_url
            User.objects.filter(pk=pk).update(avatar=link)
            return Response(
                dict(
                    success=True,
                    message="Zaktualizowano awatar",
                    data=BoardSerializer(Board.objects.all(), many=True).data,
                    data1=UserSerializer(User.objects.all(), many=True).data,
                    data2=UserSerializer(User.objects.get_by_pk(pk=pk)).data,
                    data3=remaining_helper()
                )
            )
        else:
            data = request.data.copy()
            serializer = UserSerializer(data=data, instance=user_instance, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response(
            dict(
                success=True,
                message="Użytkownik został {}.".format(user_instance and "zaktualizowany" or "dodany"),
                data=BoardSerializer(Board.objects.all(), many=True).data,
                data1=UserSerializer(User.objects.all(), many=True).data,
                data2=UserSerializer(User.objects.get_by_pk(pk=pk)).data,
                data3=remaining_helper()
            )
        )


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
