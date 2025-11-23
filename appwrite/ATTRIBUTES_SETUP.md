# Добавление атрибутов в коллекции Appwrite

## Ошибка
```
Invalid document structure: Unknown attribute: "name"
Invalid document structure: Unknown attribute: "title"
```

Эта ошибка означает, что в коллекциях не созданы атрибуты (поля).

## Решение: Добавление атрибутов

### Для коллекции `users`:

1. Откройте Appwrite Dashboard → Databases → `main` → `users`
2. Перейдите в раздел **Attributes**
3. Нажмите **Create Attribute**
4. Добавьте следующие атрибуты по очереди:

#### Атрибуты для `users`:

1. **name**
   - Type: **String**
   - Size: `255`
   - Required: ✅ (включите)
   - Array: ❌ (выключите)

2. **handle**
   - Type: **String**
   - Size: `255`
   - Required: ✅
   - Array: ❌

3. **email**
   - Type: **String**
   - Size: `255`
   - Required: ✅
   - Array: ❌

4. **avatarUrl**
   - Type: **String**
   - Size: `500`
   - Required: ❌
   - Array: ❌

5. **description**
   - Type: **String**
   - Size: `1000`
   - Required: ❌
   - Array: ❌

6. **country**
   - Type: **String**
   - Size: `10`
   - Required: ❌
   - Array: ❌

7. **language**
   - Type: **String**
   - Size: `50`
   - Required: ❌
   - Array: ❌

8. **theme**
   - Type: **String**
   - Size: `10`
   - Required: ❌
   - Array: ❌

9. **notifications** ⚠️ **ВАЖНО - добавьте этот атрибут!**
   - Type: **String**
   - Size: `2000`
   - Required: ❌
   - Array: ❌
   - ⚠️ Это будет хранить JSON как строку

10. **playback** ⚠️ **ВАЖНО - добавьте этот атрибут!**
    - Type: **String**
    - Size: `2000`
    - Required: ❌
    - Array: ❌
    - ⚠️ Это будет хранить JSON как строку

11. **privacy** ⚠️ **ВАЖНО - добавьте этот атрибут!**
    - Type: **String**
    - Size: `2000`
    - Required: ❌
    - Array: ❌
    - ⚠️ Это будет хранить JSON как строку

### Для коллекции `videos`:

1. Откройте коллекцию `videos`
2. Перейдите в **Attributes**
3. Добавьте следующие атрибуты:

1. **title** (String, 500, required) ⚠️ **ВАЖНО - начните с этого!**
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
15. **fileSize** (Integer, optional) - Type: **Integer**
16. **fileName** (String, 255, optional)
17. **userId** (String, 255, required)
18. **createdAt** (String, 100, optional)
19. **updatedAt** (String, 100, optional)

### Для коллекции `comments`:

1. Откройте коллекцию `comments`
2. Перейдите в **Attributes**
3. Добавьте следующие атрибуты:

1. **author** (String, 255, required)
2. **avatar** (String, 500, optional)
3. **text** (String, 2000, required)
4. **likes** (Integer, optional, default: 0) - Type: **Integer**
5. **videoTitle** (String, 255, required)
6. **userId** (String, 255, required)
7. **createdAt** (String, 100, optional)

## Важные замечания

- ⚠️ **Атрибуты создаются по одному** - после создания каждого атрибута нужно подождать, пока он будет обработан
- ⚠️ **Required атрибуты** должны быть помечены как обязательные
- ⚠️ **Boolean атрибуты** (например, `verified`) должны иметь Type: **Boolean**
- ⚠️ **Integer атрибуты** (например, `fileSize`, `likes`) должны иметь Type: **Integer**
- ⚠️ **String атрибуты** должны иметь указанный размер

## Быстрая проверка

После добавления всех атрибутов:

1. ✅ Коллекция `users` имеет 11 атрибутов
2. ✅ Коллекция `videos` имеет 19 атрибутов (включая `title`)
3. ✅ Коллекция `comments` имеет 7 атрибутов

## Troubleshooting

### Атрибут не создается

- Убедитесь, что вы заполнили все обязательные поля
- Проверьте, что размер String не превышает лимиты
- Подождите, пока предыдущий атрибут будет обработан

### Ошибка все еще появляется

- Убедитесь, что вы добавили все атрибуты из списка
- Проверьте, что имена атрибутов точно совпадают (регистр важен)
- Обновите страницу в браузере
- Перезапустите приложение

