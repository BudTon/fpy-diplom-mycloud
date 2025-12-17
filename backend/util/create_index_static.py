# create_index_static.py
import os
import sys
import json

# Указываем путь к файлу настроек вручную
sys.path.append(os.getcwd())  # Добавляем текущую директорию в PYTHONPATH
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "cloud.settings"
)  # Указываем модуль настроек

# Получаем доступ к настройкам вручную
from django.conf import settings

settings.configure()


def create_index_static():
    # Путь к папке dist внутри frontend
    dist_folder = os.path.join(os.getcwd(), "frontend", "dist")

    # Проверяем наличие старого index.html и удаляем его
    old_index_html = os.path.join(dist_folder, "index.html")
    if os.path.exists(old_index_html):
        os.remove(old_index_html)
        print("Старый файл index.html успешно удален.")


    # Путь к файлу manifest.json
    manifest_path = os.path.join(dist_folder, ".vite", "manifest.json")

    # Проверяем существование файла перед чтением
    if not os.path.exists(manifest_path):
        raise FileNotFoundError(f"Файл {manifest_path} не найден!")

    # Читаем манифест
    with open(manifest_path, "r") as mf:
        manifest = json.load(mf)

    # Данные из манифеста
    js_file = manifest["index.html"]["file"]
    css_files = manifest["index.html"]["css"][0]  # Берём первый элемент массива CSS

    # Формируем шаблон с использованием тегов Django
    template = f"""<!doctype html>
<html lang="en">
  <head>
    {{% load static %}}
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href={{"% static '/favicon.ico' %"}} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>cloud_frontend</title>
    <script type="module" crossorigin src="{{% static '{js_file}' %}}"></script>
    <link rel="stylesheet" crossorigin href="{{% static '{css_files}' %}}">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
"""

    # Заменяем переменные в шаблоне
    template = template.replace("{js_file}", js_file).replace("{css_files}", css_files)

    # Создаём новый index.html
    new_index_html = os.path.join(dist_folder, "index.html")
    with open(new_index_html, "w") as fh:
        fh.write(template)

    print("Файл index.html успешно создан.")


# Блок для прямого вызова функции
if __name__ == "__main__":
    create_index_static()
