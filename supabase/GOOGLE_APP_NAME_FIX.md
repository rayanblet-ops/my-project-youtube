# Исправление ошибки "app name does not comply with Google's requirements"

## Проблема
Google отклоняет имя приложения, если оно:
- Слишком короткое (меньше 4 символов)
- Содержит запрещенные слова
- Не соответствует правилам именования

## Решение

### Вариант 1: Используйте более описательное имя

При создании OAuth consent screen используйте:
- **App name**: `YuTube Video Platform` или `My Video App` или `Video Sharing App`
- **User support email**: ваш реальный email
- **Developer contact information**: ваш реальный email

**Важно**: Имя должно быть:
- Минимум 4 символа
- Без специальных символов (кроме пробелов и дефисов)
- Описательным и понятным

### Вариант 2: Используйте ваш личный бренд

Если у вас есть:
- **App name**: `[Ваше Имя] Video App` или `[Ваша Компания] Platform`
- Например: `John's Video Platform` или `MyCompany Media`

### Вариант 3: Используйте общее имя

- **App name**: `Video Sharing Application`
- **App name**: `Media Platform`
- **App name**: `Content Creator Tool`

## Пошаговая инструкция

1. В Google Cloud Console перейдите в **APIs & Services** → **OAuth consent screen**
2. Если уже создавали - нажмите **EDIT APP**
3. В поле **App name** введите одно из предложенных выше имен
4. Заполните все обязательные поля:
   - **User support email**: ваш email
   - **Developer contact information**: ваш email
5. Нажмите **SAVE AND CONTINUE**
6. На шаге **Scopes** нажмите **SAVE AND CONTINUE** (можно оставить по умолчанию)
7. На шаге **Test users** добавьте ваш email
8. Нажмите **SAVE AND CONTINUE**
9. Теперь создайте OAuth Client ID в **Credentials**

## Примеры правильных имен:

✅ **Хорошие имена:**
- `My Video Platform`
- `Video Sharing App`
- `Content Creator Tool`
- `Media Platform`
- `My Personal App`

❌ **Плохие имена:**
- `YT` (слишком короткое)
- `YouTube` (защищенное имя)
- `App` (слишком общее)
- `Test` (слишком общее)

После исправления имени приложения, создание OAuth Client ID должно пройти успешно.

