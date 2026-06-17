from django.contrib import admin
from .models import User, Todo

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "password", "created_at", "last_login_at")
    list_filter = ("name", "created_at")
    search_fields = ("name",)

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_checked", "created_at", "updated_at", "deleted_at")
    list_filter = ("user", "is_checked",)
    search_fields = ("name",)
