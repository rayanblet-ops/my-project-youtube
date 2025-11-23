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
        await authService.signUp(email, password, displayName);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Произошла ошибка';
      
      // Разные сообщения для регистрации и входа
      if (isLogin) {
        // Ошибки при входе
        if (error.code === 401 || error.message?.includes('Invalid credentials') || error.message?.includes('Invalid password') || error.message?.includes('Неверный email или пароль')) {
          errorMessage = 'Пользователь не найден или неверный пароль';
        } else if (error.code === 400 || error.message?.includes('Invalid email')) {
          errorMessage = 'Неверный формат email';
        } else if (error.code === 429 || error.message?.includes('too many requests') || error.message?.includes('Слишком много попыток')) {
          errorMessage = 'Слишком много попыток. Попробуйте позже';
        } else if (error.message?.includes('Email не подтвержден') || error.message?.includes('email verification')) {
          errorMessage = 'Email не подтвержден. Проверьте почту и подтвердите регистрацию';
        } else if (error.message?.includes('User not found') || error.message?.includes('пользователь с таким email не найден')) {
          errorMessage = 'Пользователь с таким email не найден';
        } else {
          errorMessage = error.message || 'Произошла ошибка при входе';
        }
      } else {
        // Ошибки при регистрации
        if (error.code === 409 || error.message?.includes('already exists') || error.message?.includes('already registered')) {
          errorMessage = 'Этот email уже используется';
        } else if (error.code === 400) {
          if (error.message?.includes('Invalid email')) {
            errorMessage = 'Неверный формат email';
          } else if (error.message?.includes('Password') || error.message?.includes('password')) {
            errorMessage = 'Пароль должен содержать минимум 8 символов';
          } else {
            errorMessage = 'Проверьте правильность введенных данных';
          }
        } else if (error.message?.includes('Password') || error.message?.includes('password')) {
          errorMessage = 'Пароль должен содержать минимум 8 символов';
        } else if (error.message?.includes('too many requests')) {
          errorMessage = 'Слишком много попыток. Попробуйте позже';
        } else {
          errorMessage = error.message || 'Произошла ошибка при регистрации';
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

