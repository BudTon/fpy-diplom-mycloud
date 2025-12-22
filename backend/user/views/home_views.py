from rest_framework.response import Response
from rest_framework.views import APIView
import logging

from user.models import File, UserCloud
from user.serializers import UserSerializer




logger = logging.getLogger(__name__)




class HomeView(APIView):
    authentication_classes = []
    permission_classes = []


    def get(self, request):
        logger.info("Начало обработки запроса на просмотр статистики хранилища.")

        users = UserCloud.objects.all()
        users_total = UserSerializer(users, many=True).data
        user_total_count = len(users_total)
        files_total = File.objects.all()
        files_total_count = len(files_total)
        files_total_size = sum(file.file.size for file in files_total)

        logger.info(
            f"Количество пользователей: {user_total_count}, Количество файлов: {files_total_count}, Общий объем: {files_total_size} байт."
        )

        return Response(
            {
                "status": "ok",
                "message": "Successfully retrieved storage information.",
                "totalUsers": user_total_count,
                "totalFiles": files_total_count,
                "totalSize": files_total_size,
            }
        )
