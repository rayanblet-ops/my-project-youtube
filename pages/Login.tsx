import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../appwrite/authService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Вход
        await authService.signIn(email, password);
        navigate('/');
      } else {
        // Регистрация
        if (!displayName.trim()) {
          setError('Введите имя');
          setIsLoading(false);
          return;
        }
        // Проверяем, что введен email (не имя пользователя)
        if (!email.includes('@')) {
          setError('При регистрации необходимо указать email');
          setIsLoading(false);
          return;
        }
        await authService.signUp(email, password, displayName);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Произошла ошибка';
      
      const errorMsg = error.message || '';
      const errorStr = String(errorMsg).toLowerCase();
      
      if (isLogin) {
        if (errorStr.includes('failed to fetch') || errorStr.includes('network error') || errorStr.includes('networkerror') || error.code === 'ERR_NETWORK' || error.name === 'TypeError') {
          errorMessage = 'Ошибка подключения. Проверьте интернет-соединение и настройки Appwrite.';
        } else if (error.code === 401 || errorStr.includes('invalid credentials') || errorStr.includes('invalid password') || errorStr.includes('неверный email или пароль')) {
          errorMessage = 'Пользователь не найден или неверный пароль';
        } else if (error.code === 400 || errorStr.includes('invalid email')) {
          errorMessage = 'Неверный формат email';
        } else if (error.code === 429 || errorStr.includes('too many requests') || errorStr.includes('слишком много попыток')) {
          errorMessage = 'Слишком много попыток. Попробуйте позже';
        } else if (errorStr.includes('email не подтвержден') || errorStr.includes('email verification')) {
          errorMessage = 'Email не подтвержден. Проверьте почту и подтвердите регистрацию';
        } else if (errorStr.includes('user not found') || errorStr.includes('пользователь с таким email не найден') || errorStr.includes('пользователь с таким именем не найден')) {
          errorMessage = 'Пользователь не найден. Проверьте email или имя пользователя';
        } else if (errorStr.includes('нет доступа к базе данных') || errorStr.includes('права доступа')) {
          errorMessage = 'Ошибка доступа. Проверьте настройки Appwrite Dashboard: Settings → Permissions → Read должно быть "Any"';
        } else if (errorStr.includes('база данных или коллекция не найдена')) {
          errorMessage = 'База данных не настроена. Проверьте настройки Appwrite.';
        } else {
          errorMessage = errorMsg || 'Произошла ошибка при входе';
        }
      } else {
        if (errorStr.includes('failed to fetch') || errorStr.includes('network error') || errorStr.includes('networkerror') || error.code === 'ERR_NETWORK' || error.name === 'TypeError') {
          errorMessage = 'Ошибка подключения. Проверьте интернет-соединение и настройки Appwrite.';
        } else if (error.code === 409 || errorStr.includes('already exists') || errorStr.includes('already registered')) {
          errorMessage = 'Этот email уже используется';
        } else if (error.code === 400) {
          if (errorStr.includes('invalid email')) {
            errorMessage = 'Неверный формат email';
          } else if (errorStr.includes('password')) {
            errorMessage = 'Пароль должен содержать минимум 8 символов';
          } else {
            errorMessage = 'Проверьте правильность введенных данных';
          }
        } else if (errorStr.includes('password')) {
          errorMessage = 'Пароль должен содержать минимум 8 символов';
        } else if (errorStr.includes('too many requests')) {
          errorMessage = 'Слишком много попыток. Попробуйте позже';
        } else {
          errorMessage = errorMsg || 'Произошла ошибка при регистрации';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1] dark:bg-[#1f1f1f] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-yt-base rounded-xl shadow-lg p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">YuTube</h1>
            <p className="text-gray-600 dark:text-[#aaa]">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#aaa] mb-2">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#3f3f3f] rounded-lg bg-white dark:bg-[#272727] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите ваше имя"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#aaa] mb-2">
                {isLogin ? 'Email или имя пользователя' : 'Email'}
              </label>
              <div className="relative">
                {isLogin ? (
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                  type={isLogin ? 'text' : 'email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#3f3f3f] rounded-lg bg-white dark:bg-[#272727] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={isLogin ? 'email@example.com или имя пользователя' : 'your@email.com'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#aaa] mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-[#3f3f3f] rounded-lg bg-white dark:bg-[#272727] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

