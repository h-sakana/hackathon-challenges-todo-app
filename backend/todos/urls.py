from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, UserViewSet

router = DefaultRouter()
router.register("todos", TodoViewSet)
router.register("users", UserViewSet)

urlpatterns = router.urls



