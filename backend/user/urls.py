from os import path

from rest_framework.routers import DefaultRouter

from django.contrib.auth import views as auth_views  # noqa: F401

from django.urls import (
    path,  # noqa: F811
    include,
)

from user.views.auth_views import (
    user_login,
    RegistrationView,
    RegistrationUserValidateView,
)
from user.views.file_views import (
    FileViewSet,
    download_file_link,
    FileRenameView,
    FileChangeCommentView,
)
from user.views.user_views import UserAdmin, ListUserView
from user.views.storage_views import StorageView
from user.views.home_views import HomeView


router = DefaultRouter()
router.register("files", FileViewSet)


urlpatterns = [
    path("login/", user_login, name="login"),
    path("home/", HomeView.as_view(), name="home"),
    path("register/", RegistrationView.as_view(), name="register"),
    path(
        "register/authadmin/", RegistrationUserValidateView.as_view(), name="authadmin"
    ),
    path("storage/", StorageView.as_view(), name="storage"),
    path("users/", ListUserView.as_view(), name="users"),
    path("storage/<int:pk>", StorageView.as_view(), name="storage_detail"),
    path("user/<int:user_id>/", UserAdmin.as_view(), name="user_list"),
    path(
        "download/file/<uuid:short_hash>/<str:action>",
        download_file_link,
        name="download_file_link",
    ),
    path(
        "file/rename/<int:file_id>/",
        FileRenameView.as_view(),
        name="update-filename",
    ),
    path(
        "file/comment/<int:file_id>/",
        FileChangeCommentView.as_view(),
        name="update-comment",
    ),
    path("", include(router.urls)),
]
