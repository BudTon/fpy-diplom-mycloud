import os
import logging
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework import status
from user.serializers import UserRegistrationSerializer


logger = logging.getLogger(__name__)

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        logger.info(f"Начало попытки входа пользователя с логином: {username}")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            response_data = {
                "token": token.key,
                "status": "ok",
                "userId": user.id,
                "isStaff": user.is_staff,
            }
            logger.info(
                f"Успешный вход пользователя: {username}. Ответ: {response_data}"
            )
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            logger.warning(
                f"Ошибка входа пользователя: {username}. Неверные учётные данные."
            )
            return Response(
                {"status": "error", "message": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class RegistrationUserValidateView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        auth_admin_frontend = request.data.get("auth_admin")
        auth_admin_server = os.getenv("SUPERUSER_PASSWORD")

        if auth_admin_frontend == auth_admin_server:
            logger.info("Административная проверка прошла успешно.")
            return Response({"validate": True})
        else:
            logger.warning(
                "Ошибка административной проверки. Неправильные учётные данные администратора."
            )
            return Response({"validate": False}, status=status.HTTP_401_UNAUTHORIZED)


class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"Новый пользователь успешно зарегистрирован: {user.username}")
            return Response(
                {"message": f"Пользователь {user.username} успешно зарегистрирован"},
                status=status.HTTP_201_CREATED,
            )
        else:
            logger.error(
                f"Ошибка регистрации пользователя. Детали: {serializer.errors}"
            )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
