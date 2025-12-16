import os
from django.core.management.base import BaseCommand
import psycopg2


class Command(BaseCommand):
    help = "Создайте базу данных, если она ещё не создана"

    def handle(self, *args, **options):
        with open('.env', 'r') as file:
            for line in file:
                if line.startswith('#') or not line.strip():
                    continue
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

        user = os.getenv("USER_PSQL")
        password = os.getenv("PASSWORD_PSQL")
        host = os.getenv("HOST_PSQL")
        port = os.getenv("PORT_PSQL")
        db_name = os.getenv("NAME_PSQL")

        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )
        conn.autocommit = True

        cursor = conn.cursor()

        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        exists = cursor.fetchone()

        if exists:
            self.stdout.write(self.style.WARNING(f"База данных '{db_name}' уже существует"))
        else:
            cursor.execute(f"CREATE DATABASE {db_name}")
            self.stdout.write(self.style.SUCCESS(f"База данных '{db_name}' успешно создана"))

        cursor.close()
        conn.close()
