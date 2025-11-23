# Быстрая настройка Google OAuth

## Шаг 1: Получение Client ID и Client Secret

### 1.1. Создайте OAuth приложение в Google Cloud Console

1. Перейдите на https://console.cloud.google.com/
2. Создайте новый проект или выберите существующий
3. Перейдите в **APIs & Services** → **Credentials**
4. Нажмите **+ CREATE CREDENTIALS** → **OAuth client ID**

### 1.2. Настройте OAuth consent screen (если еще не настроен)

Если появится запрос:
- Выберите **External** (для тестирования)
- Заполните:
  - **App name**: YuTube (или любое имя)
  - **User support email**: ваш email
  - **Developer contact information**: ваш email
- Нажмите **SAVE AND CONTINUE** на всех шагах
- На шаге **Test users** добавьте свой email

### 1.3. Создайте OAuth Client ID

1. **Application type**: выберите **Web application**
2. **Name**: YuTube Web Client (или любое имя)
3. **Authorized JavaScript origins**: добавьте:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
   (для локальной разработки)
4. **Authorized redirect URIs**: добавьте:
   ```
   https://mhiiswceyaitskrrqspf.supabase.co/auth/v1/callback
   ```
   ⚠️ **ВАЖНО**: Используйте именно этот URL из вашего Supabase проекта!
5. Нажмите **CREATE**
6. **Скопируйте Client ID** (выглядит как: `123456789-abcdefg.apps.googleusercontent.com`)
7. **Скопируйте Client Secret** (выглядит как: `GOCSPX-xxxxxxxxxxxxx`)

## Шаг 2: Вставьте данные в Supabase

В Supabase Dashboard → Authentication → Providers → Google:

1. **Client IDs**: вставьте скопированный **Client ID**
   - Пример: `123456789-abcdefg.apps.googleusercontent.com`
   - Можно добавить несколько через запятую, но для начала достаточно одного

2. **Client Secret (for OAuth)**: вставьте скопированный **Client Secret**
   - Пример: `GOCSPX-xxxxxxxxxxxxx`

3. Нажмите **Save**

## Шаг 3: Проверка

1. Перезагрузите страницу входа
2. Нажмите "Продолжить с Google"
3. Должен произойти редирект на Google для авторизации

## Важно!

- **Callback URL** в Supabase уже правильный: `https://mhiiswceyaitskrrqspf.supabase.co/auth/v1/callback`
- Этот же URL должен быть добавлен в **Authorized redirect URIs** в Google Cloud Console
- Client Secret должен храниться в секрете (не публикуйте в открытом доступе)

## Если что-то не работает:

1. Проверьте, что Client ID и Client Secret скопированы правильно (без пробелов)
2. Убедитесь, что redirect URI в Google Cloud Console точно совпадает с Callback URL из Supabase
3. Проверьте, что OAuth consent screen настроен и ваш email добавлен в Test users
4. Подождите несколько минут после сохранения (иногда настройки применяются с задержкой)

