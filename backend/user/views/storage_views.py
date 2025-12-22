from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import logging

from django.core.files.storage import default_storage

from user.models import File, UserCloud
from user.serializers import FileSerializer

from util.generate_download_link import generate_download_link



logger = logging.getLogger(__name__)




class StorageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination


    def get_paginator(self):
        return self.pagination_class()


    def get(self, request):
        paginator = self.get_paginator()
        user_id = request.query_params.get('user_id', None)

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

            user_files = File.objects.filter(user=target_user).select_related('user')
            serializer = FileSerializer(user_files, many=True)
            page = paginator.paginate_queryset(serializer.data, request)
            total_pages = paginator.page.paginator.num_pages

            logger.info(
                f"Получена информация о хранении для пользователя {target_user.username}. Всего страниц: {total_pages}."
            )
            return Response(
                {
                    "status": "ok",
                    "message": "Информация о хранении успешно получена.",
                    "user_name": str(target_user),
                    "userId": target_user.id,
                    "total_pages": total_pages,
                    "user_files": page,
                },
                status=status.HTTP_200_OK,
            )

        else:
            logger.warning("Попытка получить информацию о хранении без авторизации.")
            return Response(
                {"status": "error", "message": "Недействительные учетные данные."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


    def post(self, request):
        if request.method == "POST":
            file_obj = request.FILES.get('file')
            user_storage = request.POST.get('user_storage')
            user = UserCloud.objects.get(username=user_storage)

            if file_obj:
                file_name = file_obj.name
                file_type = file_obj.content_type
                file_size = file_obj.size
                comment = request.POST.get('comment')
                uploaded_file = File(
                    user=user,
                    file_name=file_name,
                    type=file_type,
                    file=file_obj,
                    size=file_size,
                    comment=comment,
                )
                uploaded_file.save()
                file_links = generate_download_link(request, uploaded_file)
                uploaded_file.links = file_links
                uploaded_file.save()

                logger.info(
                    f"Файл успешно загружен пользователем {user.username}. Имя файла: {
                        file_name}."
                )
                return Response(
                    {"message": "Файл успешно загружен!"},
                    status=status.HTTP_201_CREATED,
                )
            else:
                logger.warning("Попытка загрузить пустой файл.")
                return Response(
                    {"error": "Файл не найден."}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            {"error": "Метод не поддерживается."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


    def delete(self, request, pk=None):
        user_id = request.GET.get('user_id')
        file_id = request.GET.get('file_id')

        if request.method == 'DELETE' and request.user.is_authenticated:
            try:
                target_user = UserCloud.objects.get(id=user_id)
                file_instance = File.objects.get(id=file_id, user=target_user)
                path_to_file = file_instance.file.path
                default_storage.delete(path_to_file)
                file_instance.delete()

                logger.info(
                    f"Файл удалён пользователем {target_user.username}. ID файла: {
                        file_id}."
                )
                return Response(
                    {"status": "ok", "message": "Файл успешно удалён!"},
                    status=status.HTTP_204_NO_CONTENT,
                )
            except (UserCloud.DoesNotExist, File.DoesNotExist):
                logger.error(
                    f"Ошибка удаления файла: Пользователь с ID {
                        user_id} или файл с ID {file_id} не найдены."
                )
                return Response(
                    {"status": "error", "message": "Файл не найден."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(
            {"status": "error", "message": "Метод не поддерживается."},
            status=status.HTTP_404_NOT_FOUND,
        )
