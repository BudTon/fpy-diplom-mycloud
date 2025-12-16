from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import UserCloud, File
from django.urls import reverse
from django.utils.html import format_html
from django.utils.safestring import mark_safe


@admin.register(UserCloud)
class UserCloudAdmin(DefaultUserAdmin):
    list_display = (
        "id",
        "username",
        "first_name",
        "email",
        "count_files",
        "total_file_size",
        "is_staff",
        "link_to_files",
    )

    readonly_fields = ["count_files", "total_file_size"]
    list_editable = ["is_staff"]

    def count_files(self, instance):
        return instance.count_files()

    def total_file_size(self, instance):
        return instance.total_file_size()

    def get_username(self, instance):
        return instance.username

    def get_first_name(self, instance):
        return instance.first_name

    def link_to_files(self, instance):
        url = (
            reverse("admin:user_file_changelist")
            + "?user__id__exact="
            + str(instance.pk)
        )
        return format_html('<a href="{}">Список файлов</a>', url)

    link_to_files.short_description = "Файлы пользователя"
    get_username.short_description = "Логин"
    get_first_name.short_description = "Полное имя"
    count_files.short_description = "Количество файлов"
    total_file_size.short_description = "Общий размер файлов"
    # Удобные фильтры для поиска пользователей
    list_filter = ("is_staff", "is_superuser", "groups")

    # Возможность поиска пользователей по нескольким полям
    search_fields = ("username", "first_name", "last_name", "email")

    # Группа для выбора ролей (разделение групп и прав горизонтальным выбором)
    filter_horizontal = ("groups", "user_permissions")


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = (
        "file_name",
        "user",
        "size",
        "type",
        "download_button",
        "view_button",
    )
    readonly_fields = ("download_button", "view_button")

    # Метод для кнопки скачивания
    def download_button(self, obj):
        if obj.links.get("download"):
            print("-------------------")
            print(obj.links.get("download"), "obj.links.get(download)")
            print("-------------------")
            download_url = obj.links.get("download")
            return mark_safe(
                f'<button><a href="{download_url}" download>Скачать</a></button>'
            )
        return "-"

    download_button.short_description = "Скачать"

    # Метод для кнопки просмотра
    def view_button(self, obj):
        if obj.links.get("view"):
            return mark_safe(
                f'<button><a href="{obj.links["view"]}" target="_blank">Просмотреть</a></button>'
            )
        return "-"

    view_button.short_description = "Просмотреть"
