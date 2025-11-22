# 🔥 СРОЧНО: Исправление правил Firestore

## ❌ Проблема: "Missing or insufficient permissions"

Ошибка означает, что правила Firestore блокируют доступ к коллекции `users`.

## ✅ РЕШЕНИЕ: Настройте правила Firestore ПРЯМО СЕЙЧАС

### Шаг 1: Откройте Firebase Console
1. https://console.firebase.google.com/
2. Выберите проект **"youtube"** (fir-7bb8f)
3. Перейдите в **Firestore Database** → **Rules**

### Шаг 2: ВСТАВЬТЕ ЭТИ ПРАВИЛА (скопируйте полностью):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Правила для пользователей - ВАЖНО!
    match /users/{userId} {
      allow read: if true;  // Все могут читать
      allow write: if request.auth != null && request.auth.uid == userId;  // Только владелец может писать
    }
    
    // Правила для видео
    match /videos/{videoId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Правила для комментариев
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

### Шаг 3: ОБЯЗАТЕЛЬНО
1. Нажмите **"Publish"** (Опубликовать)
2. Подождите **2 минуты**
3. Обновите страницу приложения (F5)
4. Попробуйте войти снова

## ⚠️ ВАЖНО: Правила для Storage тоже нужны!

### Storage Rules (Storage → Rules):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Нажмите Publish и подождите 2 минуты!**

## 🔍 Проверка:

После применения правил:
1. Обновите страницу (F5)
2. Выйдите и войдите снова
3. Ошибки "Missing or insufficient permissions" должны исчезнуть

