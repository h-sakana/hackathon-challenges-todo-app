from django.db import models

class User(models.Model):
    name = models.CharField(max_length=40)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

class Todo(models.Model):
    user = models.ForeignKey (
        User,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    is_checked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name







