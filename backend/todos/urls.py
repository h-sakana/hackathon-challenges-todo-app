from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, UserViewSet, LoginView, LoginCheckView

router = DefaultRouter()
router.register("todos", TodoViewSet)
router.register("users", UserViewSet)

urlpatterns = router.urls + [
    path("login/", LoginView.as_view()),
    path("login_check/", LoginCheckView.as_view())
]



