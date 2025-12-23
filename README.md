# Облачное хранилище My Cloud

## Описание проекта

"My Cloud" — это веб-приложение, работающее как облачное хранилище, позволяющее пользователям отображать, загружать, отправлять, скачивать и переименовывать файлы. Данное приложение создано по [заданию к дипломному проекту](task_diplom.md).

Проект включает:
1. Локальную версию:
   - Бэкенд на Python с использованием фреймворка Django и СУБД PostgreSQL.
   - Фронтенд на JavaScript с использованием React, Redux и React Router.
2. Развернутое на сервере REG.RU [приложение](http://194.67.124.226/).


## Инструкция по запуску локальной версии

1. В IDE cоздаём рабочую папку для проекта ("Add Folder to Workspace ...")
2. Открываем и запускаем встроенный терминал в созданной папке
3. Клонируем репозиторий:
```bash
git clone https://github.com/BudTon/fpy-diplom-mycloud.git
```
4. Переходим в папку `fpy-diplom-mycloud` затем в директорию `backend` и запускаем встроенный терминал

5. Создаём виртуальное окружение:
```bash
python -m venv env
```
6. Активируем виртуальное окружение:
```bash
env/Scripts/activate
```
7. Устанавливаем зависимости:
```bash
pip install -r requirements.txt
```
8. Копируем файл .env.example в новый файл .env и редактируем его в соответствии с шаблоном:
```bash
cp .env.example .env
```
9. Открываем второй терминал в директории `frontend` в папке `fpy-diplom-mycloud`

10.  В файле `.env` указываем базовый URL сервера и количество элементов для пагинации страницы:
```bash
VITE_BASE_URL=http://127.0.0.1:8000/

VITE_ITEMS_PER_PAGE=10 #как на сервере
```

11.  Устанавливаем необходимые зависимости:
```bash
yarn add vite
```

12. Собираем статические файлы `frontend` в папку `backend\frontend\distr`
```bash
yarn build
```
13. Возвращаемся на первый терминал в папке `backend`.

14. Создаём базу данных и запускаем сервер с учётом настроек указанных в файле `.env` и созданных статических данных:

```bash
python setup.py
```

***ВНИМАНИЕ!!!*** Убедитесь, что сервер PostgreSQL запущен.

15. Теперь приложение развернуто на одном локальном сервере http://127.0.0.1:8000/


## Развёртывание приложения на облачном сервере

1. Выбираем на сайте [reg.ru](https://cloud.reg.ru) параметры облачного сервера:
  - образ - `Ubuntu 22.04 LTS`
   - vCPU и тип диска - `Стандартный`
   - тариф - `HP C1-M1-D10`
   - регион размещения - `Москва`

###  Нажимаем кнопку `Заказать сервер`

   Получаем по электронной почте данные для подключения к серверу через SSH.
2. Запускаем терминал и подключаемся к серверу, используя полученные данные:
```bash
ssh root@<ip адрес сервера>
```
   Вводим пароль
3. Создаем нового пользователя:
```bash
adduser <имя пользователя>
```
4. Добавляем созданного пользователя в группу `sudo`:
```bash
usermod <имя пользователя> -aG sudo
```
5. Выходим из-под пользователя `root`:
```bash
logout
```
6. Подключаемся к серверу под новым пользователем:
```bash
ssh <имя пользователя>@<ip адрес сервера>
```
7. Скачиваем обновления пакетов `apt`:
```bash
sudo apt update
```
8. Устанавливаем необходимые пакеты:
```bash
sudo apt install python3-venv python3-pip postgresql nginx
```
9. Заходим в терминал `psql` под пользователем `postgres`:
```bash
sudo -u postgres psql
```
10. Создаём базу данных:
```bash
CREATE DATABASE cloud_diploma;
```
10.   Задаём пароль для пользователя `postgres`:
```bash
alter user postgres with password 'postgres';
```
11.   Выходим из терминала `psql`:
```bash
\q
```
12.   Клонируем репозиторий с проектом:
```bash
git clone https://github.com/BudTon/fpy-diplom-mycloud.git
```
13.   Переходим в папку `backend`:
```bash
cd /home/<имя пользователя>/fpy-diplom-mycloud/backend
```
14.   Устанавливаем виртуальное окружение:
```bash
python3 -m venv env
```
15.   Активируем его:
```bash
source env/bin/activate
```
16.   Устанавливаем необходимые зависимости:
```bash
pip install -r requirements.txt
```
17.   В папке `backend` копируем файл .env.example в новый файл .env и редактируем его в соответствии с шаблоном:
```bash
cp .env.example .env
```
```bash
nano .env
```
 _`примечание`_: _Обязательные условия для настройки production переменных_
```bash
1 DEBUG=False
2 ALLOWED_HOSTS=ваш-домен.reg.ru,ip-адрес
3 CORS_ALLOWED_ORIGINS=http://ваш-домен.reg.ru
```
 _`примечание`_: _Пояснения о назначенни свойств_
```bash
MEDIA_ROOT = BASE_DIR / "storage" # папка для хранения загруженых файлов
STATIC_ROOT = BASE_DIR / "static" # папка где собираютс все статические файлы командой python manage.py collectstatic
```

18.   Переходим в папку `frontend`:
```bash
cd ../frontend
```
19.   Pедактируем файл .env соответствии с шаблоном:
```bash
nano .env
```
```
VITE_BASE_URL=http://ваш-домен.reg.ru

VITE_ITEMS_PER_PAGE=10

```
20.Устанавливаем [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
21.  Добавляем переменную окружения:
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
22.  Проверяем версию `nvm`:
```bash
nvm -v
```
23.  Устанавливаем нужную версию `node`:
```bash
nvm install v24.2.0
```
24.  Устанавливаем необходимые зависимости:
```bash
npm install -g yarn
```
25.  Устанавливаем необходимые зависимости:
```bash
yarn add vite
```

26.  Производим сборку фронтенда:
```bash
yarn build
```
Полученные файлы сразу переносятся в папку `backend` директорию `/frontend/dist/`

27. Переходим в папку `backend`
```bash
cd ../backend
```
28. Проверяем создание макетов моделий:
```bash
python manage.py makemigrations user
```
29. Применяем миграции:
```bash
python manage.py migrate
```
30. Создаём суперпользователя:
```bash
python manage.py create_superuser
```
31. Добавляем шаблон {%static%} в файл index.html:
```bash
python create_index_static.py
```
32. Собираем весь статичный контент в одну папку на сервере:
```bash
python manage.py collectstatic
```
33. Запускаем сервер:
```bash
python manage.py runserver 0.0.0.0:8000
```
34.  Проверяем работу `gunicorn`:
```bash
gunicorn cloud.wsgi -b 0.0.0.0:8000
```
35.  Создаём сокет `gunicorn.socket`:
```bash
sudo nano /etc/systemd/system/gunicorn.socket
```
   со следующим содержимым

```bash
      [Unit]
      Description=gunicorn socket

      [Socket]
      ListenStream=/run/gunicorn.sock

      [Install]
      WantedBy=sockets.target
```
36. Создаём сервис `gunicorn.service`:
```bash
   sudo nano /etc/systemd/system/gunicorn.service
```
   с содержимым

```bash
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=<имя пользователя>
Group=www-data
WorkingDirectory=/home/<имя пользователя>/fpy-diplom-mycloud/backend
ExecStart=/home/<имя пользователя>/fpy-diplom-mycloud/backend/env/bin/gunicorn \
         --access-logfile - \
         --workers=3 \
         --bind unix:/run/gunicorn.sock \
         cloud.wsgi:application

[Install]
WantedBy=multi-user.target
```
37. Запускаем сокет `gunicorn.socket`:
```bash
sudo systemctl start gunicorn.socket
```
```bash
sudo systemctl enable gunicorn.socket
```
38. Проверяем его статус:
```bash
sudo systemctl status gunicorn.socket
```
39. Убеждаемся, что файл `gunicorn.sock` присутствует в папке `/run`:
```bash
file /run/gunicorn.sock
```
40. Проверяем статус `gunicorn`:
```bash
sudo systemctl status gunicorn
```
41. Создаём модуль `nginx`:
```bash
sudo nano /etc/nginx/sites-available/backend
```
   со следующим содержимым

```bash
      server {
         listen 80;
         server_name <ip адрес сервера>;

         location = /favicon.ico {
            access_log off;
            log_not_found off;
         }

         location /static/ {
            alias /home/<имя пользователя>/fpy-diplom-mycloud/backend/static/;
         }

         location / {
            include proxy_params;
            proxy_pass http://unix:/run/gunicorn.sock;
         }

      }
```
42.  Активируем виртуальный хост, создаём символическую ссылку:
```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled
```
43. Добавляем пользователя `www-data` в группу текущего пользователя:
```bash
sudo usermod -aG <имя пользователя> www-data
```
44.   Диагностируем `nginx` на предмет ошибок в синтаксисе:
```bash
sudo nginx -t
```
45.   Перезапускаем веб-сервер:
```bash
sudo systemctl restart nginx
```
46.   Проверяем статус `nginx`:
```bash
sudo systemctl status nginx
```
47.   При помощи `firewall` даём полные права `nginx` для подключений:
```bash
sudo ufw allow 'Nginx Full'
```
48.  Проверяем доступ к сайту:
```bash
http://<ip адрес сервера>
```
49.   Проверяем доступ к административной панели:
```bash
http://<ip адрес сервера>/admin/
```

