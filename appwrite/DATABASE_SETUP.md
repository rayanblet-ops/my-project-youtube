# Настройка базы данных в Appwrite

## Ошибка
```
Database not found
```

Эта ошибка означает, что в Appwrite не создана база данных с ID `main`.

## Решение: Создание базы данных и коллекций

### Шаг 1: Создание базы данных

1. Откройте [Appwrite Cloud Console](https://cloud.appwrite.io/)
2. Войдите в свой аккаунт
3. Выберите проект (Project ID: `692232df000ec6518cd8`)
4. В боковом меню нажмите **Databases**
5. Нажмите **Create Database**
6. Заполните:
   - **Database ID**: `main` ⚠️ **ВАЖНО**: Используйте именно это имя!
   - **Name**: `Main Database` (или любое другое имя для отображения)
7. Нажмите **Create**

### Шаг 2: Создание коллекции `users`

1. Откройте созданную базу данных `main`
2. Нажмите **Create Collection**
3. Заполните:
   - **Collection ID**: `users` ⚠️ **ВАЖНО**: Используйте именно это имя!
   - **Name**: `Users`
4. Нажмите **Create Collection**

#### Добавление атрибутов в коллекцию `users`:

После создания коллекции, добавьте следующие атрибуты (Attributes):

1. **name** (String, 255, required)
2. **handle** (String, 255, required)
3. **email** (String, 255, required)
4. **avatarUrl** (String, 500, optional)
5. **description** (String, 1000, optional)
6. **country** (String, 10, optional)
7. **language** (String, 50, optional)
8. **theme** (String, 10, optional)
9. **notifications** (String, JSON, optional)
10. **playback** (String, JSON, optional)
11. **privacy** (String, JSON, optional)

#### Настройка прав доступа для `users`:

Перейдите в **Settings** → **Permissions**:

- **Create**: `Users` (любой авторизованный пользователь)
- **Read**: `Any` (любой)
- **Update**: `Users` (только владелец документа)
- **Delete**: `Users` (только владелец документа)

### Шаг 3: Создание коллекции `videos`

1. В базе данных `main` нажмите **Create Collection**
2. Заполните:
   - **Collection ID**: `videos`
   - **Name**: `Videos`
3. Нажмите **Create Collection**

#### Добавление атрибутов в коллекцию `videos`:

1. **title** (String, 500, required)
2. **channelName** (String, 255, required)
3. **channelAvatarUrl** (String, 500, optional)
4. **views** (String, 50, optional)
5. **postedAt** (String, 100, optional)
6. **verified** (Boolean, optional)
7. **description** (String, 5000, optional)
8. **subscribers** (String, 50, optional)
9. **likes** (String, 50, optional)
10. **videoUrl** (String, 1000, required)
11. **videoFileId** (String, 255, optional)
12. **thumbnailUrl** (String, 1000, optional)
13. **duration** (String, 20, optional)
14. **type** (String, 20, optional)
15. **fileSize** (Integer, optional)
16. **fileName** (String, 255, optional)
17. **userId** (String, 255, required)
18. **createdAt** (String, 100, optional)
19. **updatedAt** (String, 100, optional)

#### Настройка прав доступа для `videos`:

- **Create**: `Users`
- **Read**: `Any`
- **Update**: `Users` (только владелец)
- **Delete**: `Users` (только владелец)

### Шаг 4: Создание коллекции `comments`

1. В базе данных `main` нажмите **Create Collection**
2. Заполните:
   - **Collection ID**: `comments`
   - **Name**: `Comments`
3. Нажмите **Create Collection**

#### Добавление атрибутов в коллекцию `comments`:

1. **author** (String, 255, required)
2. **avatar** (String, 500, optional)
3. **text** (String, 2000, required)
4. **likes** (Integer, optional, default: 0)
5. **videoTitle** (String, 255, required)
6. **userId** (String, 255, required)
7. **createdAt** (String, 100, optional)

#### Настройка прав доступа для `comments`:

- **Create**: `Users`
- **Read**: `Any`
- **Update**: `Users` (только владелец)
- **Delete**: `Users` (только владелец)

## Важные замечания

- **Database ID** должен быть точно `main` (без пробелов, в нижнем регистре)
- **Collection IDs** должны быть точно: `users`, `videos`, `comments`
- Все атрибуты должны быть созданы с правильными типами
- Права доступа должны быть настроены для каждой коллекции

## Быстрая проверка

После создания всех коллекций проверьте:

1. ✅ База данных `main` создана
2. ✅ Коллекция `users` создана с атрибутами
3. ✅ Коллекция `videos` создана с атрибутами
4. ✅ Коллекция `comments` создана с атрибутами
5. ✅ Права доступа настроены для всех коллекций

## Troubleshooting

### Ошибка все еще появляется

- Убедитесь, что вы создали базу данных в правильном проекте
- Проверьте, что Database ID точно `main`
- Проверьте, что Collection IDs точно `users`, `videos`, `comments`
- Обновите страницу в браузере
- Перезапустите приложение (`npm run dev`)

### Ошибка "Collection not found"

- Проверьте, что коллекции созданы в базе данных `main`
- Убедитесь, что Collection IDs совпадают с теми, что в `appwrite/config.ts`

### Ошибка "Attribute not found"

- Убедитесь, что все атрибуты созданы в коллекциях
- Проверьте типы атрибутов (String, Integer, Boolean)
- Проверьте, что обязательные атрибуты помечены как required

