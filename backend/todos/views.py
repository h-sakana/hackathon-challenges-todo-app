from rest_framework import viewsets
from .models import Todo, User
from .serializers import TodoSerializer, UserSerializer

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.filter(deleted_at__isnull=True)
    serializer_class = TodoSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

