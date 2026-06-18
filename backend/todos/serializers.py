from rest_framework import serializers
from .models import Todo, User

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["id", "user", "name", "is_checked", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def validate_name(self, name):
        name = name.strip()

        if not name:
            raise serializers.ValidationError("タスク名を入力してください。")
        
        return name

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "password", "created_at", "last_login_at"]
        read_only_fields = ["id", "created_at", "last_login_at"]




