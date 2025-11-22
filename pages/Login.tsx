import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../firebase/authService';

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
        await authService.signUp(email, password, displayName);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Произошла ошибка';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Этот email уже используется';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Неверный формат email';
          break;
        case 'auth/weak-password':
          errorMessage = 'Пароль должен содержать минимум 6 символов';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Пользователь не найден';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Неверный пароль';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Слишком много попыток. Попробуйте позже';
          break;
        default:
          errorMessage = error.message || 'Произошла ошибка при авторизации';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await authService.signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        // Пользователь закрыл окно - не показываем ошибку
        return;
      } else if (error.code === 'auth/popup-blocked') {
        setError('Всплывающее окно заблокировано. Разрешите всплывающие окна для этого сайта в настройках браузера.');
      } else if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        setError('Ошибка доступа к базе данных. Проверьте правила безопасности Firestore в Firebase Console.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Ошибка при входе через Google. Проверьте консоль браузера (F12) для деталей.');
      }
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

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full mb-6 flex items-center justify-center gap-3 bg-white dark:bg-[#272727] border-2 border-gray-300 dark:border-[#3f3f3f] text-black dark:text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#3f3f3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Продолжить с Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-[#3f3f3f]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-yt-base text-gray-500">или</span>
            </div>
          </div>

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
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-[#3f3f3f] rounded-lg bg-white dark:bg-[#272727] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
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

