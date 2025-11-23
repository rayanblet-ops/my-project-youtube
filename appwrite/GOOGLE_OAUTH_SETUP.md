# Настройка Google OAuth в Appwrite

## Шаг 1: Создание OAuth приложения в Google Cloud Console

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Перейдите в **APIs & Services** → **Credentials**
4. Нажмите **+ CREATE CREDENTIALS** → **OAuth client ID**

### Настройка OAuth consent screen (если еще не настроен)

Если появится запрос:
- Выберите **External** (для тестирования)
- Заполните:
  - **App name**: `My Video Platform` или `Video Sharing App` (не используйте "YuTube" или "YouTube")
  - **User support email**: ваш email
  - **Developer contact information**: ваш email
- Нажмите **SAVE AND CONTINUE** на всех шагах
- На шаге **Test users** добавьте ваш email: `celkabust17@gmail.com`

### Создание OAuth Client ID

1. **Application type**: выберите **Web application**
2. **Name**: `Appwrite OAuth Client` (или любое имя)
3. **Authorized JavaScript origins**: добавьте:
   ```
   https://cloud.appwrite.io
   ```
   ⚠️ **ВАЖНО**: Используйте именно `https://cloud.appwrite.io` для Appwrite Cloud
4. **Authorized redirect URIs**: добавьте:
   ```
   https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/692232df000ec6518cd8
   ```
   ⚠️ **ВАЖНО**: Замените `692232df000ec6518cd8` на ваш Project ID, если он отличается
5. Нажмите **CREATE**
6. **Скопируйте Client ID** (выглядит как: `123456789-abc.apps.googleusercontent.com`)
7. **Скопируйте Client Secret** (выглядит как: `GOCSPX-xxxxxxxxxxxxx`)

## Шаг 2: Настройка в Appwrite Dashboard

1. Откройте [Appwrite Cloud Console](https://cloud.appwrite.io/)
2. Выберите ваш проект (Project ID: `692232df000ec6518cd8`)
3. Перейдите в **Auth** → **Providers**
4. Найдите **Google** в списке провайдеров
5. Включите переключатель **Enable Google provider**
6. Вставьте:
   - **App ID (Client ID)**: скопированный Client ID из Google Cloud Console
   - **App Secret (Client Secret)**: скопированный Client Secret из Google Cloud Console
7. **Scopes**: оставьте по умолчанию (обычно `openid`, `email`, `profile`)
8. Нажмите **Update**

## Шаг 3: Проверка

1. Перезагрузите страницу входа в вашем приложении
2. Нажмите "Продолжить с Google"
3. Должен произойти редирект на Google для авторизации
4. После авторизации вы вернетесь на ваш сайт

## Важные замечания

- **Authorized redirect URI** должен точно совпадать с форматом:
  ```
  https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/YOUR_PROJECT_ID
  ```
- Замените `YOUR_PROJECT_ID` на ваш Project ID: `692232df000ec6518cd8`
- **Authorized JavaScript origins** должен быть: `https://cloud.appwrite.io`
- Client Secret должен храниться в безопасности

## Troubleshooting

### Ошибка "The OAuth client was not found" или "401: invalid_client"
- Проверьте, что Client ID и Client Secret правильно скопированы (без пробелов)
- Убедитесь, что Google провайдер включен в Appwrite Dashboard
- Проверьте, что redirect URI в Google Cloud Console точно совпадает с форматом выше
- Убедитесь, что ваш email добавлен в Test users в Google Cloud Console

### Ошибка "redirect_uri_mismatch"
- Проверьте, что redirect URI в Google Cloud Console точно совпадает:
  ```
  https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/692232df000ec6518cd8
  ```
- Убедитесь, что нет лишних пробелов или символов

### Ошибка "access_denied"
- Убедитесь, что вы добавили ваш email (`celkabust17@gmail.com`) в Test users в Google Cloud Console
- Проверьте настройки OAuth consent screen

## Альтернатива: Использование только Email/Password

Если настройка Google OAuth вызывает проблемы, вы можете временно использовать только Email/Password авторизацию. Кнопка Google просто не будет работать, но остальная функциональность будет доступна.

