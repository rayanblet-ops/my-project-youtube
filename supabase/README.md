# Настройка Supabase

## Шаги для настройки

### 1. Создайте Storage Bucket

1. Откройте Supabase Dashboard
2. Перейдите в **Storage**
3. Создайте новый bucket с именем `videos`
4. Настройте политики доступа:
   - **Public**: Да (чтобы видео были доступны для просмотра)
   - **File size limit**: По вашему усмотрению (рекомендуется 50MB+)
   - **Allowed MIME types**: `video/*,image/*`

### 2. Выполните SQL скрипт

1. Откройте Supabase Dashboard
2. Перейдите в **SQL Editor**
3. Скопируйте содержимое файла `supabase/schema.sql`
4. Вставьте в SQL Editor и выполните

### 3. Настройте OAuth (Google)

1. Откройте Supabase Dashboard
2. Перейдите в **Authentication** → **Providers**
3. Включите **Google**
4. Добавьте:
   - **Client ID** (из Google Cloud Console)
   - **Client Secret** (из Google Cloud Console)
5. Добавьте URL редиректа: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### 4. Обновите конфигурацию

Откройте `supabase/config.ts` и замените `YOUR_SUPABASE_PROJECT_URL` на ваш Project URL из Settings → API.

### 5. Установите зависимости

```bash
npm install
```

## Структура базы данных

- **users** - Профили пользователей
- **videos** - Видео и метаданные
- **comments** - Комментарии к видео

## Политики безопасности (RLS)

Все таблицы защищены Row Level Security:
- Пользователи могут видеть все профили
- Пользователи могут редактировать только свой профиль
- Видео доступны всем для просмотра
- Пользователи могут создавать/редактировать/удалять только свои видео
- Комментарии доступны всем для просмотра
- Пользователи могут создавать комментарии и удалять свои

