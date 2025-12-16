from rest_framework.viewsets import ModelViewSet
from user.serializers import UserSerializer, FileSerializer
from user.models import File, UserCloud
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.core.files.storage import default_storage
from rest_framework.pagination import PageNumberPagination


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
                    return Response(
                        {
                            "status": "error",
                            "message": f"User with ID '{user_id}' does not exist.",
                        },
                        status=404,
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

            return Response(
                {
                    "status": "ok",
                    "message": "Successfully retrieved storage information.",
                    "user_name": str(target_user),
                    "userId": target_user.id,
                    "total_pages": total_pages,
                    "users": page,
                }
            )

        else:
            return Response(
                {"status": "error", "message": "Invalid credentials."}, status=401
            )


class UserAdmin(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):

        try:
            user = UserCloud.objects.get(pk=user_id)
        except UserCloud.DoesNotExist:
            return Response(
                {"detail": "Пользаватель не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_is_staff = request.data.get("newIsStaff", user.is_staff)
        user.is_staff = new_is_staff
        user.save()

        return Response(
            {"detail": "Метаданные пользователя успешно обновлены"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, user_id):

        try:
            user_delete = UserCloud.objects.get(pk=user_id)
        except UserCloud.DoesNotExist:
            return Response(
                {"detail": "Пользаватель не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "DELETE" and request.user.is_authenticated:
            files_delete = File.objects.filter(user=user_delete)
            if files_delete:
                for file_del in files_delete:
                    path_to_file = file_del.file.path
                    default_storage.delete(path_to_file)
                File.objects.filter(user=user_delete).delete()
            user_delete.delete()

            return Response(
                {"status": "ok", "message": "Файл успешно удален!"},
                status=204
            )

        return Response(
            {"status": "error", "message": "Метод не поддерживается."},
            status=404
        )
