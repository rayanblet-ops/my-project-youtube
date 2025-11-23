# Настройка Storage Bucket в Appwrite

## Ошибка
```
Storage bucket with the requested ID could not be found.
```

Эта ошибка означает, что в Appwrite не создан Storage bucket с ID `videos`.

## Решение: Создание Storage Bucket

### Шаг 1: Откройте Appwrite Dashboard

1. Перейдите на [cloud.appwrite.io](https://cloud.appwrite.io/)
2. Войдите в свой аккаунт
3. Выберите проект с ID: `692232df000ec6518cd8`

### Шаг 2: Создайте Storage Bucket

1. В боковом меню нажмите **Storage**
2. Нажмите кнопку **Create Bucket** (или **+ Create bucket**)
3. Заполните форму:
   - **Bucket ID**: `videos` ⚠️ **ВАЖНО**: Используйте именно это имя!
   - **Name**: `Videos` (или любое другое имя для отображения)
   - **File security**: Выберите **Bucket can be accessed using the File API**
     - Это позволит получать файлы по публичным URL
4. Нажмите **Create**

### Шаг 3: Настройте права доступа

После создания bucket:

1. Откройте созданный bucket `videos`
2. Перейдите в раздел **Settings** или **Permissions**
3. Настройте права доступа:
   - **Create**: `Users` (любой авторизованный пользователь)
   - **Read**: `Any` (любой, даже неавторизованный)
   - **Update**: `Users` (только авторизованные пользователи)
   - **Delete**: `Users` (только авторизованные пользователи)

### Шаг 4: Настройте ограничения (опционально)

В настройках bucket можно установить:

- **Allowed file extensions**: 
  - Оставьте пустым для всех типов файлов
  - Или укажите: `mp4,webm,avi,mov,jpg,jpeg,png,gif`
  
- **Maximum file size**: 
  - Рекомендуется: `100 MB` или больше
  - По умолчанию может быть 10MB

- **Encryption**: По желанию
- **Antivirus**: По желанию

### Шаг 5: Проверка

После создания bucket:

1. Убедитесь, что Bucket ID точно `videos` (без пробелов, в нижнем регистре)
2. Проверьте, что bucket виден в списке Storage
3. Попробуйте снова загрузить видео в приложении

## Альтернатива: Изменить ID bucket в коде

Если вы хотите использовать другое имя для bucket:

1. Создайте bucket с любым ID (например, `my-videos`)
2. Откройте `appwrite/config.ts`
3. Измените:
   ```typescript
   export const STORAGE_BUCKET_ID = 'my-videos'; // ваше имя bucket
   ```

## Troubleshooting

### Bucket все еще не найден после создания

- Убедитесь, что вы создали bucket в правильном проекте (Project ID: `692232df000ec6518cd8`)
- Проверьте, что Bucket ID точно `videos` (без пробелов, регистр важен)
- Обновите страницу в браузере
- Перезапустите приложение (`npm run dev`)

### Ошибка доступа к файлам

- Проверьте права доступа в bucket
- Убедитесь, что **Read** разрешен для **Any** (если хотите публичный доступ)
- Проверьте настройку **File security**

### Файл слишком большой

- Увеличьте **Maximum file size** в настройках bucket
- Или уменьшите размер загружаемого файла

