# Браузерная игра "The Last of Guss"

В этом репозитории содержится моё решение тестового задания для компании "Круглый Квадрат". Описание тестового задания
можно найти [по ссылке](https://github.com/round-squares/tech-task-for-interview/wiki).

## Замечания

Учитывая что это тестовое задание, ограниченность времени и, что-бы в точности соответствовать требованиям, вашему
вниманию предстваляется решение "в лоб". В реальном продакшен коде я бы некоторые вещи сделал не так:

- Шардировал бы раунды. То есть, привязал бы конкретный раунд к определённому инстансу бакэнда и работал бы с
  количеством кликов in-memory. На худой конец, использовал бы in-memory cache типа Redis;
- Использовал бы WebSockets для динамического обновления фронтэнда, что-бы избежать поллинга;
- Использовал бы два токена (access и refresh), что бы пользователя не выкидывало через сутки;
- Убрал бы ботинок с картинки ткнутого Гуся. 😃 У меня бесплатные запросы на генерацию к нейросетке кончились...

## Зависимости

Что-бы локально запустить проект, вам нужно иметь:
- Node.js
- PostgreSQL запущенную локально или в докере (я тестировал с 17.7)

## Запуск проекта

- запустите БД (см. следующую секцию)
- пропишите адрес БД в переменную `DATABASE_URL` в файле `backend/.env`
- запустите backend:
```bash
$ cd backend
$ npm install
$ npx prisma migrate dev # если стартуете с пустой БД
$ npx prisma generate    # если восстановили из дампа
$ npm run start:dev
```
- запустите frontend в другом терминале:
```bash
$ cd frontend
$ npm install
$ npm run dev
```
- откройте в браузере http://localhost:5173

## Как настроить БД

Prisma использует shadow database при применении миграций, поэтому пользователь с которым вы подключаете backend должен
иметь полные права свою БД И право создавать БД!

Ва можете создать пользователя и БД следующими коммандами (для локального сервера:
`psql -U postgres -h localhost -p 5432`):
```sql
CREATE USER guss WITH PASSWORD 'guss_secret';
ALTER USER guss CREATEDB;
CREATE DATABASE guss;
ALTER DATABASE guss OWNER TO guss;
GRANT ALL PRIVILEGES ON DATABASE guss TO guss;
\c guss
GRANT ALL ON SCHEMA public TO guss;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO guss;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO guss;
```

Что-бы не начинать с пустой БД, можете восстановить тестовые данные из дампа:
```bash
$ pg_restore --dbname=$DATABASE_URL --no-owner --no-acl --verbose dump/test.dump
```

Пользователи зарегестрированные в тестовой БД:
- admin, пароль: admin
- Никита, пароль: nikita
- Вадим, пароль: vadim
- Вася, пароль: vasya
