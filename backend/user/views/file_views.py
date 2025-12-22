from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
import logging

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone

from user.models import File
from user.serializers import FileSerializer



logger = logging.getLogger(__name__)




class FileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer




class DownloadFileLinkView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, short_hash, action):
        logger.info(
            f"Начало обработки запроса на скачивание файла с hash={short_hash}, action={action}"
        )
        uploaded_file = get_object_or_404(File, short_hash=short_hash)

        if action.lower() == "view":
            disposition = "inline"
            logger.info(f"Файл с hash={short_hash} просмотрен пользователем")
            response = FileResponse(
                uploaded_file.file.open(), content_type=uploaded_file.type
            )
        else:
            disposition = "attachment"
            response = FileResponse(
                uploaded_file.file.open(), content_type="application/octet-stream"
            )
            uploaded_file.lastDownloadDate = timezone.now()
            uploaded_file.save()
            logger.info(f"Файл с hash={short_hash} скачан пользователем")

        response["Content-Disposition"] = (
            f'{disposition}; filename="{uploaded_file.file_name}"'
        )
        return response



class FileRenameView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, file_id):
        logger.info(f"Запрос на переименование файла с id={file_id}")
        try:
            file = File.objects.get(pk=file_id)
        except File.DoesNotExist:
            logger.error(f"Файл с id={file_id} не найден")
            return Response(
                {"detail": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        new_file_name = request.data.get("newFileName", file.file_name)
        file.file_name = new_file_name
        file.save()
        logger.info(f"Файл с id={file_id} переименован в {new_file_name}")
        return Response(
            {"detail": "Метаданные файла успешно обновлены"}, status=status.HTTP_200_OK
        )



class FileChangeCommentView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, file_id):
        logger.info(f"Запрос на изменение комментария файла с id={file_id}")
        try:
            file = File.objects.get(pk=file_id)
        except File.DoesNotExist:
            logger.error(f"Файл с id={file_id} не найден")
            return Response(
                {"detail": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        new_comment = request.data.get("newComment", file.comment)
        file.comment = new_comment
        file.save()
        logger.info(f"Комментарий файла с id={file_id} изменён на '{new_comment}'")
        return Response(
            {"detail": "Метаданные файла успешно обновлены"}, status=status.HTTP_200_OK
        )
