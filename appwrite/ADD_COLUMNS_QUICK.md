# Быстрое добавление колонок в Appwrite

## Вы находитесь в правильном месте!

Вы видите сообщение "You have no columns yet" - это нормально. Нужно добавить колонки (атрибуты).

## Что делать:

### Вариант 1: Создать колонки вручную (рекомендуется)

1. Нажмите кнопку **"Create column"** (справа)
2. Заполните форму для каждой колонки:

#### Для коллекции `users` добавьте следующие колонки:

**1. name**
- **Key**: `name`
- **Type**: `String`
- **Size**: `255`
- **Required**: ✅ (включите)
- Нажмите **Create**

**2. handle**
- **Key**: `handle`
- **Type**: `String`
- **Size**: `255`
- **Required**: ✅
- Нажмите **Create**

**3. email**
- **Key**: `email`
- **Type**: `String`
- **Size**: `255`
- **Required**: ✅
- Нажмите **Create**

**4. avatarUrl**
- **Key**: `avatarUrl`
- **Type**: `String`
- **Size**: `500`
- **Required**: ❌ (выключите)
- Нажмите **Create**

**5. description**
- **Key**: `description`
- **Type**: `String`
- **Size**: `1000`
- **Required**: ❌
- Нажмите **Create**

**6. country**
- **Key**: `country`
- **Type**: `String`
- **Size**: `10`
- **Required**: ❌
- Нажмите **Create**

**7. language**
- **Key**: `language`
- **Type**: `String`
- **Size**: `50`
- **Required**: ❌
- Нажмите **Create**

**8. theme**
- **Key**: `theme`
- **Type**: `String`
- **Size**: `10`
- **Required**: ❌
- Нажмите **Create**

**9. notifications**
- **Key**: `notifications`
- **Type**: `String`
- **Size**: `2000`
- **Required**: ❌
- Нажмите **Create**

**10. playback**
- **Key**: `playback`
- **Type**: `String`
- **Size**: `2000`
- **Required**: ❌
- Нажмите **Create**

**11. privacy**
- **Key**: `privacy`
- **Type**: `String`
- **Size**: `2000`
- **Required**: ❌
- Нажмите **Create**

### После добавления всех колонок в `users`:

1. Перейдите в коллекцию `videos` (в левом меню)
2. Откройте вкладку **Columns**
3. Нажмите **"Create column"**
4. Добавьте все колонки для `videos` (см. список ниже)

### Колонки для коллекции `videos`:

1. **title** (String, 500, required) ⚠️ **Начните с этого!**
2. **channelName** (String, 255, required)
3. **channelAvatarUrl** (String, 500, optional)
4. **views** (String, 50, optional)
5. **postedAt** (String, 100, optional)
6. **verified** (Boolean, optional) - Type: **Boolean**
7. **description** (String, 5000, optional)
8. **subscribers** (String, 50, optional)
9. **likes** (String, 50, optional)
10. **videoUrl** (String, 1000, required)
11. **videoFileId** (String, 255, optional)
12. **thumbnailUrl** (String, 1000, optional)
13. **duration** (String, 20, optional)
14. **type** (String, 20, optional)
15. **fileSize** (Integer, optional) - Type: **Integer**
16. **fileName** (String, 255, optional)
17. **userId** (String, 255, required)
18. **createdAt** (String, 100, optional)
19. **updatedAt** (String, 100, optional)

### Колонки для коллекции `comments`:

1. **author** (String, 255, required)
2. **avatar** (String, 500, optional)
3. **text** (String, 2000, required)
4. **likes** (Integer, optional) - Type: **Integer**
5. **videoTitle** (String, 255, required)
6. **userId** (String, 255, required)
7. **createdAt** (String, 100, optional)

## Важно:

- ⚠️ Создавайте колонки **по одной** - после каждой нажимайте **Create**
- ⚠️ **Required** колонки должны быть помечены как обязательные
- ⚠️ Для **Boolean** (например, `verified`) выберите Type: **Boolean**
- ⚠️ Для **Integer** (например, `fileSize`, `likes`) выберите Type: **Integer**
- ⚠️ Для остальных выберите Type: **String** с указанным размером

## После добавления всех колонок:

1. Обновите страницу в браузере
2. Перезапустите приложение (`npm run dev`)
3. Попробуйте снова зарегистрироваться или загрузить видео

