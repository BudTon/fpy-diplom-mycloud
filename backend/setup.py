import subprocess

# Выполняем команду для создания базы данных
print("Создание базы данных...")
subprocess.run(["python", "manage.py", "create_db"])
print("База данных создана.")

# Выполняем миграцию
print("Выполнение миграций...")
subprocess.run(["python", "manage.py", "makemigrations", "user"])
subprocess.run(["python", "manage.py", "migrate"])
print("Миграции выполнены.")

# Выполняем команду для создания суперпользователя
print("Создание суперпользователя по умолчаанию")
subprocess.run(["python", "manage.py", "create_superuser"])
print("Суперпользователь создан.")

# Собираем весь статичный контент в одну папку на сервере:
print("Собираем весь статичный контент в одну папку на сервере")
subprocess.run(["python", "create_index_static.py"])
subprocess.run(["python", "manage.py", "collectstatic"])
print("Статитака собрана")

# Запускаем сервер
print("Запуск сервера...")
subprocess.run(["python", "manage.py", "runserver"])
