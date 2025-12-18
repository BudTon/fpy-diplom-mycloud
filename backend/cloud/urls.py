"""
URL configuration for cloud project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic.base import TemplateView
from django.conf import settings
from django.conf.urls.static import static

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
    path("admin/", admin.site.urls),
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
    # path("", include(router.urls)),
    # path("", include("user.urls")),
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]

print("-----------------\n\nurls settings.STATIC_URL\n\n------------------")
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
