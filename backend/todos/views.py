from rest_framework import viewsets
from .models import Todo, User
from .serializers import TodoSerializer, UserSerializer

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.filter(deleted_at__isnull=True)
    serializer_class = TodoSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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



