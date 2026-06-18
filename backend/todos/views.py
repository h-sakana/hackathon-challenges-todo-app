from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import IntegrityError
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Todo, User
from .serializers import TodoSerializer, UserSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.none()
    permission_classes = [IsAuthenticated]
    serializer_class = TodoSerializer
    
    def get_queryset(self):
        status = self.request.query_params.get("status")
        
        is_deleted = status == "del"

        return Todo.objects.filter(
            user=self.request.user,
            deleted_at__isnull=not is_deleted
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        todo = self.get_object()
        
        if todo.deleted_at is None:
            todo.deleted_at = timezone.now()
            todo.save()

            return Response(
                {"message": "タスクを論理削除しました。"},
                status=status.HTTP_200_OK
            )
        
        todo.delete()

        return Response(
            {"message": "タスクを物理削除しました。"},
            status=status.HTTP_200_OK
        )
        
        



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        name = request.data.get("name")
        password = request.data.get("password")

        if not name or not password:
            return Response(
                {"message": "ユーザー名とパスワードは必須です。"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.create(
                name=name,
                password=make_password(password)
            )
        except IntegrityError:
            return Response(
                {"message": "このユーザー名は既に使用されています。"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {"id": user.id, "name": user.name},
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        name = request.data.get("name")
        password = request.data.get("password")

        if not name or not password:
            return Response(
                {"message": "ユーザー名とパスワードは必須です。"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(name=name)
        except User.DoesNotExist:
            return Response(
                {"message": "ユーザー名またはパスワードに誤りがあります。"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not check_password(password, user.password):
            return Response(
                {"message": "ユーザー名またはパスワードに誤りがあります。"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken()
        refresh["user_id"] = user.id
        refresh["name"] = user.name

        user.last_login_at = timezone.now()
        user.save()

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "name": user.name
                }
            },
            status=status.HTTP_200_OK
        )

class LoginCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return Response(
                {"message": "未ログイン"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = auth_header.split(" ")[1]

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
        except (TokenError, KeyError):
            return Response(
                {"message": "未ログイン"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"message": "未ログイン"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(
            {"id": user.id, "name": user.name},
            status=status.HTTP_200_OK
        )



