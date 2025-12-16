from rest_framework import serializers
from user.models import File, UserCloud


class UserCloudCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCloud
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = UserCloud.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCloud
        fields = (
            "id",
            "username",
            "first_name",
            "email",
            "is_staff",
        )


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"
        read_only_fields = ("id", "short_hash", "created_at", "size")
