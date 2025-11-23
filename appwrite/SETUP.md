# Настройка Appwrite

## Шаг 1: Создание проекта в Appwrite Cloud

1. Перейдите на [appwrite.io](https://appwrite.io)
2. Нажмите **Get Started** или **Sign Up**
3. Создайте аккаунт (можно через GitHub, Google, или email)
4. После входа нажмите **Create Project**
5. Введите имя проекта (например: "YuTube")
6. Нажмите **Create**

## Шаг 2: Получение API ключей

1. В вашем проекте перейдите в **Settings** → **API**
2. Найдите раздел **Project ID** - скопируйте его
3. **Endpoint** обычно: `https://cloud.appwrite.io/v1` (для Cloud версии)
4. Обновите `appwrite/config.ts`:
   ```typescript
   const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
   const APPWRITE_PROJECT_ID = 'ваш_project_id';
   ```

## Шаг 3: Создание базы данных

1. Перейдите в **Databases** в боковом меню
2. Нажмите **Create Database**
3. Имя: `main` (или любое другое, но обновите `DATABASE_ID` в `config.ts`)
4. Нажмите **Create**

### Создание коллекций

#### Коллекция `users`:

1. В базе данных нажмите **Create Collection**
2. Collection ID: `users`
3. Name: `Users`
4. Нажмите **Create Collection**

**Атрибуты:**
- `name` (String, 255, required)
- `handle` (String, 255, required)
- `email` (String, 255, required)
- `avatarUrl` (String, 500, optional)
- `description` (String, 1000, optional)
- `country` (String, 10, optional)
- `language` (String, 50, optional)
- `theme` (String, 10, optional)
- `notifications` (String, JSON, optional)
- `playback` (String, JSON, optional)
- `privacy` (String, JSON, optional)

**Права доступа:**
- Create: Users (любой авторизованный пользователь)
- Read: Any (любой)
- Update: Users (только владелец документа)
- Delete: Users (только владелец документа)

#### Коллекция `videos`:

1. Создайте коллекцию с ID: `videos`
2. Name: `Videos`

**Атрибуты:**
- `title` (String, 500, required)
- `channelName` (String, 255, required)
- `channelAvatarUrl` (String, 500, optional)
- `views` (String, 50, optional)
- `postedAt` (String, 100, optional)
- `verified` (Boolean, optional)
- `description` (String, 5000, optional)
- `subscribers` (String, 50, optional)
- `likes` (String, 50, optional)
- `videoUrl` (String, 1000, required)
- `videoFileId` (String, 255, optional)
- `thumbnailUrl` (String, 1000, optional)
- `duration` (String, 20, optional)
- `type` (String, 20, optional)
- `fileSize` (Integer, optional)
- `fileName` (String, 255, optional)
- `userId` (String, 255, required)
- `createdAt` (String, 100, optional)
- `updatedAt` (String, 100, optional)

**Права доступа:**
- Create: Users
- Read: Any
- Update: Users (только владелец)
- Delete: Users (только владелец)

#### Коллекция `comments`:

1. Создайте коллекцию с ID: `comments`
2. Name: `Comments`

**Атрибуты:**
- `author` (String, 255, required)
- `avatar` (String, 500, optional)
- `text` (String, 2000, required)
- `likes` (Integer, optional, default: 0)
- `videoTitle` (String, 255, required)
- `userId` (String, 255, required)
- `createdAt` (String, 100, optional)

**Права доступа:**
- Create: Users
- Read: Any
- Update: Users (только владелец)
- Delete: Users (только владелец)

## Шаг 4: Создание Storage Bucket

1. Перейдите в **Storage** в боковом меню
2. Нажмите **Create Bucket**
3. Bucket ID: `videos`
4. Name: `Videos`
5. **File security**: Выберите **Bucket can be accessed using the File API**
6. Нажмите **Create**

**Настройки Bucket:**
- **Allowed file extensions**: `mp4,webm,avi,mov,jpg,jpeg,png,gif` (или оставьте пустым для всех)
- **Maximum file size**: Установите по вашему усмотрению (например, 100MB)
- **Encryption**: По желанию
- **Antivirus**: По желанию

**Права доступа:**
- Create: Users
- Read: Any
- Update: Users
- Delete: Users

## Шаг 5: Настройка Authentication

1. Перейдите в **Auth** → **Settings**
2. Включите **Email/Password** authentication
3. (Опционально) Настройте **OAuth providers**:
   - Перейдите в **Auth** → **Providers**
   - Включите **Google** (или другие провайдеры)
   - Добавьте Client ID и Client Secret из Google Cloud Console
   - **Redirect URL**: `http://localhost:5173` (для разработки) или ваш домен

## Шаг 6: Установка зависимостей

```bash
npm install
```

## Шаг 7: Запуск приложения

```bash
npm run dev
```

## Важные замечания

- **Project ID** и **Endpoint** должны быть правильно настроены в `appwrite/config.ts`
- Убедитесь, что все коллекции созданы с правильными ID
- Проверьте права доступа для каждой коллекции
- Для продакшена обновите Redirect URLs в OAuth настройках

## Troubleshooting

### Ошибка "Project not found"
- Проверьте, что Project ID правильный в `appwrite/config.ts`
- Убедитесь, что используете правильный Endpoint

### Ошибка "Collection not found"
- Проверьте, что ID коллекций совпадают с теми, что в `config.ts`
- Убедитесь, что Database ID правильный

### Ошибка "Storage bucket not found"
- Проверьте, что Bucket ID совпадает с `STORAGE_BUCKET_ID` в `config.ts`

### Ошибка авторизации
- Убедитесь, что Email/Password authentication включен
- Проверьте права доступа в коллекциях

