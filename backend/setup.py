import os
import subprocess

# Выполняем команду для создания суперпользователя
print("Создание суперпользователя...")
subprocess.run(["python", "manage.py", "create_superuser"])
print("Суперпользователь создан.")

# Выполняем команду для создания базы данных
print("Создание базы данных...")
subprocess.run(["python", "manage.py", "create_db"])
print("База данных создана.")

# Выполняем миграцию
print("Выполнение миграций...")
subprocess.run(["python", "manage.py", "makemigrations", "user"])
subprocess.run(["python", "manage.py", "migrate"])
print("Миграции выполнены.")

# Запускаем сервер
print("Запуск сервера...")
subprocess.run(["python", "manage.py", "runserver"])
