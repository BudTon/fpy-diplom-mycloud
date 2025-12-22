import os
from pathlib import Path


# Определение директорий
BASE_DIR = Path(__file__).resolve().parent.parent
log_file = os.path.join(BASE_DIR, "backend/logs/server.log")


if os.path.exists(log_file):
    print(f"Файл логов {log_file} существует. Очищаем...")
    with open(log_file, "w"):
        pass
    print(f"Файл логов {log_file} очищен!")
else:
    print(f"Файл логов {log_file} не найден. Ничего не делаем.")
