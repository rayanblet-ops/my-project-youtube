# Настройка Google OAuth в Supabase

## Шаг 1: Создание OAuth приложения в Google Cloud Console

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Перейдите в **APIs & Services** → **Credentials**
4. Нажмите **Create Credentials** → **OAuth client ID**
5. Если появится запрос на настройку OAuth consent screen:
   - Выберите **External** (для тестирования) или **Internal** (для G Suite)
   - Заполните обязательные поля:
     - App name: YuTube (или любое другое имя)
     - User support email: ваш email
     - Developer contact information: ваш email
   - Нажмите **Save and Continue**
   - На шаге **Scopes** нажмите **Save and Continue**
   - На шаге **Test users** добавьте свой email (для тестирования)
   - Нажмите **Save and Continue**
6. Вернитесь в **Credentials** и создайте **OAuth client ID**:
   - Application type: **Web application**
   - Name: YuTube Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (или ваш локальный порт)
     - `http://localhost:3000`
     - `https://YOUR_DOMAIN.com` (для продакшена)
   - Authorized redirect URIs:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - Замените `YOUR_PROJECT_REF` на ваш Project Reference из Supabase Dashboard
7. Нажмите **Create**
8. Скопируйте **Client ID** и **Client Secret**

## Шаг 2: Настройка в Supabase

1. Откройте [Supabase Dashboard](https://app.supabase.com/)
2. Выберите ваш проект
3. Перейдите в **Authentication** → **Providers**
4. Найдите **Google** в списке провайдеров
5. Включите переключатель **Enable Google provider**
6. Вставьте:
   - **Client ID (for OAuth)**: скопированный из Google Cloud Console
   - **Client Secret (for OAuth)**: скопированный из Google Cloud Console
7. Нажмите **Save**

## Шаг 3: Проверка

1. Перезапустите ваше приложение
2. Попробуйте войти через Google
3. Должен произойти редирект на Google для авторизации
4. После авторизации вы вернетесь на ваш сайт

## Важные замечания

- **Authorized redirect URI** должен точно совпадать с форматом: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Для продакшена добавьте ваш домен в **Authorized JavaScript origins**
- Если используете локальную разработку, добавьте `http://localhost:PORT` в origins
- Client Secret должен храниться в безопасности и не попадать в публичный репозиторий

## Troubleshooting

### Ошибка "provider is not enabled"
- Убедитесь, что Google провайдер включен в Supabase Dashboard
- Проверьте, что вы сохранили настройки после включения

### Ошибка "redirect_uri_mismatch"
- Проверьте, что redirect URI в Google Cloud Console точно совпадает с форматом Supabase
- Формат: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Ошибка "access_denied"
- Убедитесь, что вы добавили свой email в Test users (для тестирования)
- Проверьте настройки OAuth consent screen

