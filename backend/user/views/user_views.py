from rest_framework.viewsets import ModelViewSet
from user.serializers import UserSerializer
from user.models import File, UserCloud
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.core.files.storage import default_storage
from rest_framework.pagination import PageNumberPagination
import logging


logger = logging.getLogger(__name__)


class UserViewSet(ModelViewSet):
    queryset = UserCloud.objects.all()
    serializer_class = UserSerializer


class ListUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_paginator(self):
        return self.pagination_class()

    def get(self, request):
        paginator = self.get_paginator()
        user_id = request.query_params.get("user_id", None)

        if request.user.is_authenticated:
            target_user = None

            if user_id is not None:
                try:
                    target_user = UserCloud.objects.get(id=user_id)
                except UserCloud.DoesNotExist:
                    logger.error(f"Пользователь с ID '{user_id}' не найден.")
                    return Response(
                        {
                            "status": "error",
                            "message": f"Пользователь с ID '{user_id}' не найден.",
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
            else:
                target_user = request.user

            if request.user.is_staff:
                users = UserCloud.objects.all().prefetch_related("file_set")
                user_serializer = UserSerializer(users, many=True)
                page = paginator.paginate_queryset(user_serializer.data, request)
                total_pages = paginator.page.paginator.num_pages
                for user_data in page:
                    files = File.objects.filter(user=user_data["id"])
                    user_data["total_size"] = sum(file.file.size for file in files)
                    user_data["file_count"] = len(files)
            else:
                page = []

            logger.info(
                f"Получена информация о хранилище для пользователя {target_user.username}. Всего страниц: {total_pages}."
            )
            return Response(
                {
                    "status": "ok",
                    "message": "Информация о хранилище успешно получена.",
                    "user_name": str(target_user),
                    "userId": target_user.id,
                    "total_pages": total_pages,
                    "users": page,
                },
                status=status.HTTP_200_OK,
            )

        else:
            logger.warning("Попытка получить информацию о хранилище без авторизации.")
            return Response(
                {"status": "error", "message": "Недействительные учетные данные."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class UserAdmin(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        try:
            user = UserCloud.objects.get(pk=user_id)
        except UserCloud.DoesNotExist:
            logger.error(
                f"Пользователь ID {user_id} не найден."
            )
            return Response(
                {"detail": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        new_is_staff = request.data.get("newIsStaff", user.is_staff)
        user.is_staff = new_is_staff
        user.save()
        logger.info(
            f"Права пользователя с именем {user.username} и ID {user_id} обновлены."
        )
        return Response(
            {"detail": "Метаданные пользователя успешно обновлены"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, user_id):
        try:
            user_delete = UserCloud.objects.get(pk=user_id)
        except UserCloud.DoesNotExist:
            logger.error(f"Пользователь с ID {user_id} не найден.")
            return Response(
                {"detail": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "DELETE" and request.user.is_authenticated:
            files_delete = File.objects.filter(user=user_delete)
            if files_delete:
                for file_del in files_delete:
                    path_to_file = file_del.file.path
                    default_storage.delete(path_to_file)
                File.objects.filter(user=user_delete).delete()
            user_delete.delete()
            logger.info(
                f"Пользователь с именем {user_delete.username} и ID {user_id} и его файлы успешно удалены."
            )
            return Response(
                {"status": "ok", "message": "Пользователь успешно удалён!"},
                status=status.HTTP_204_NO_CONTENT,
            )

        return Response(
            {"status": "error", "message": "Метод не поддерживается."},
            status=status.HTTP_404_NOT_FOUND,
        )
