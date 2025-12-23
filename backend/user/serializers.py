import re
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from user.models import File, UserCloud
from django.core.validators import EmailValidator
from django.core.validators import RegexValidator




class UserCloudCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCloud
        fields = ['username', 'email', 'password']
        extra_kwargs = {"password": {"write_only": True}}


    def create(self, validated_data):
        user = UserCloud.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user




class UserSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserCloud
        fields = (
            'id',
            'username',
            'first_name',
            'email',
            'is_staff',
        )




class FileSerializer(serializers.ModelSerializer):


    class Meta:
        model = File
        fields = '__all__'
        read_only_fields = ('id', 'short_hash', 'created_at', 'size')




class UserRegistrationSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserCloud
        fields = ['id', 'username', 'first_name', 'email', 'password', 'is_staff']
        extra_kwargs = {"password": {"write_only": True}}


    def validate_username(self, value):
        regex = r"^[a-zA-Z][a-zA-Z0-9]{3,19}$"

        if not re.match(regex, value):
            raise serializers.ValidationError(
                {
                    "error_code": "INVALID_USERNAME_FORMAT",
                    "detail": _(
                        "Логин должен начинаться с буквы и содержать только латинские буквы и цифры длиной от 4 до 20 символов."
                    ),
                },
                code="INVALID_USERNAME_FORMAT",
            )

        if UserCloud.objects.filter(username=value).exists():

            raise serializers.ValidationError(
                {
                    "error_code": "USERNAME_ALREADY_EXISTS",
                    "detail": _("Такое имя пользователя уже занято."),
                },
                code="USERNAME_ALREADY_EXISTS"
            )
        return value


    def validate_email(self, value):

        validator = EmailValidator(message=_("Некорректный формат email"))
        try:
            validator(value)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                {
                    "error_code": "INVALID_EMAIL_FORMAT",
                    "detail": _("Некорректный формат email."),
                },
                code="INVALID_EMAIL_FORMAT"
            )

        if UserCloud.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                {
                    "error_code": "EMAIL_ALREADY_EXISTS",
                    "detail": _("Такой email уже занят."),
                },
                code="EMAIL_ALREADY_EXISTS"
            )
        return value

    def validate_password(self, value):
        regex = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{6,}$"

        validator = RegexValidator(
            regex=regex,
            message=_(
                "Пароль должен содержать минимум 6 символов, "
                "одну заглавную букву, одну цифру и один специальный символ."
            ),
        )

        try:
            validator(value)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                {
                    "error_code": "WEAK_PASSWORD",
                    "detail": _(
                        "Пароль должен содержать минимум 6 символов, "
                        "одну заглавную букву, одну цифру и один специальный символ."
                    ),
                },
                code="WEAK_PASSWORD",
            )

        return value


    def create(self, validated_data):
        return UserCloud.objects.create_user(**validated_data)
