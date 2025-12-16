import os
from user.models import UserCloud
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Создайте суперпользователя, если он ещё не создан"

    def handle(self, *args, **options):
        username = os.getenv("SUPERUSER_USERNAME")
        first_name = os.getenv("SUPERUSER_FIRSTNAME")
        email = os.getenv("SUPERUSER_EMAIL")
        password = os.getenv("SUPERUSER_PASSWORD")

        if UserCloud.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'Суперпользователь "{username}" уже существует')
            )
        else:
            UserCloud.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
            )
            self.stdout.write(
                self.style.SUCCESS(f'Суперпользователь "{username}" успешно создан')
            )
