# YuTube Clone

Функциональный клон YouTube на React с интеграцией Appwrite.

## Технологии

- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- Appwrite (Database, Storage, Auth)

## Установка и запуск

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Настройте Appwrite:
   - Создайте проект на [appwrite.io](https://appwrite.io) (бесплатно!)
   - Следуйте инструкции в `appwrite/SETUP.md`
   - Создайте базу данных и коллекции (users, videos, comments)
   - Создайте Storage bucket с именем `videos`
   - Обновите `appwrite/config.ts` с вашим Project ID и Endpoint
   - Настройте Authentication (Email/Password и опционально OAuth)

3. Запустите приложение:
   ```bash
   npm run dev
   ```

## Функции

- Авторизация (email/password, Google OAuth, анонимная)
- Загрузка видео и изображений в Appwrite Storage
- Просмотр видео
- Комментарии
- Управление каналом
- История просмотров

## Структура проекта

- `appwrite/` - Конфигурация и сервисы Appwrite
  - `config.ts` - Конфигурация клиента Appwrite
  - `authService.ts` - Сервис авторизации
  - `videoService.ts` - Сервис для работы с видео
  - `commentService.ts` - Сервис для работы с комментариями
  - `SETUP.md` - Подробная инструкция по настройке

## Почему Appwrite?

- ✅ **Полностью бесплатный** для небольших проектов
- ✅ **Простая настройка** OAuth (особенно Google)
- ✅ **Хорошая документация** и поддержка
- ✅ **Встроенные функции**: Auth, Database, Storage
- ✅ **Self-hosted опция** (можно развернуть на своем сервере)

Подробнее о настройке Appwrite см. `appwrite/SETUP.md`.
