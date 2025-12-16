from django.http import JsonResponse
from util.generate_download_link import generate_download_link
from user.serializers import FileSerializer
from user.models import File, UserCloud
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from django.core.files.storage import default_storage


class StorageView(APIView):
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

            user_files = File.objects.filter(user=target_user).select_related("user")
            serializer = FileSerializer(user_files, many=True)
            page = paginator.paginate_queryset(serializer.data, request)
            total_pages = paginator.page.paginator.num_pages

            return Response(
                {
                    "status": "ok",
                    "message": "Successfully retrieved storage information.",
                    "user_name": str(target_user),
                    "userId": target_user.id,
                    "total_pages": total_pages,
                    "user_files": page,
                }
            )

        else:
            return Response(
                {"status": "error", "message": "Invalid credentials."}, status=401
            )

    def post(self, request):
        if request.method == "POST":
            file_obj = request.FILES.get("file")
            user_storage = request.POST.get("user_storage")
            user = UserCloud.objects.get(username=user_storage)

            if file_obj:
                file_name = file_obj.name
                file_type = file_obj.content_type
                file_size = file_obj.size
                comment = request.POST.get("comment")
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
                return JsonResponse({"message": "Файл успешно загружен!"})
            else:
                return JsonResponse({"error": "Файл не найден."}, status=400)

        return JsonResponse({"error": "Метод не поддерживается."}, status=405)

    def delete(self, request, pk=None):
        user_id = request.GET.get("user_id")
        target_user = UserCloud.objects.get(id=user_id)
        file_id = request.GET.get("file_id")

        if request.method == "DELETE" and request.user.is_authenticated:
            file_instance = File.objects.get(id=file_id, user=target_user)
            print("file_instance:", file_instance)
            path_to_file = file_instance.file.path
            default_storage.delete(path_to_file)
            file_instance.delete()
            return Response(
                {"status": "ok", "message": "Файл успешно удален!"}, status=204
            )

        return Response(
            {"status": "error", "message": "Метод не поддерживается."}, status=404
        )
