# Правила безопасности Firebase

## ⚠️ ВАЖНО: Настройте эти правила в консоли Firebase!

### 1. Firestore Rules (Cloud Firestore > Rules)

Скопируйте и вставьте в консоль Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Правила для видео
    match /videos/{videoId} {
      // Все могут читать видео
      allow read: if true;
      // Только авторизованные пользователи могут создавать видео
      // И только владелец может обновлять/удалять
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Правила для комментариев
    match /comments/{commentId} {
      // Все могут читать комментарии
      allow read: if true;
      // Только авторизованные пользователи могут создавать комментарии
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.author == request.auth.uid;
    }
    
    // Правила для пользователей
    match /users/{userId} {
      // Все могут читать профили
      allow read: if true;
      // Только владелец может обновлять свой профиль
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. Storage Rules (Storage > Rules)

⚠️ **ВАЖНО**: Если вы видите ошибку CORS, это означает, что правила безопасности блокируют запрос!

Скопируйте и вставьте в консоль Firebase:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Правила для видео пользователей
    match /videos/{userId}/{allPaths=**} {
      // Все могут читать файлы
      allow read: if true;
      // Только авторизованный пользователь может загружать файлы в свою папку
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Если ошибка CORS все еще появляется:**
1. Убедитесь, что вы нажали **Publish** после изменения правил
2. Подождите 1-2 минуты для применения правил
3. Обновите страницу приложения
4. Попробуйте загрузить файл снова

## Как применить правила:

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект "youtube" (fir-7bb8f)
3. Для Firestore:
   - Перейдите в **Cloud Firestore** > **Rules**
   - Вставьте правила выше
   - Нажмите **Publish**
4. Для Storage:
   - Перейдите в **Storage** > **Rules**
   - Вставьте правила выше
   - Нажмите **Publish**

## Проверка:

После применения правил:
1. Обновите страницу приложения
2. Попробуйте загрузить видео снова
3. Откройте консоль браузера (F12) для просмотра логов

