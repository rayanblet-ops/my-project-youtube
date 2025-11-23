
import React, { useState, useRef, useEffect } from 'react';
import { Upload as UploadIcon, X, FileVideo, CheckCircle2, Image as ImageIcon, ListPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Video } from '../types';
import { videoService } from '../appwrite/videoService';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [contentType, setContentType] = useState<'video' | 'image'>('video');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('1');
  const [language, setLanguage] = useState('ru');
  const [monetization, setMonetization] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
      setFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      
      const isImage = file.type.startsWith('image/');
      setContentType(isImage ? 'image' : 'video');
      
      // Для Firebase Storage нет ограничений по размеру как в localStorage
      setIsFileTooLarge(false);

      // Создаем preview URL для отображения
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep('details');
      simulateUpload();
    } else {
      alert("Пожалуйста, загрузите видео или изображение");
    }
  };

  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handlePublish = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const isImage = contentType === 'image';
      
      // Подготовка данных видео
      const videoData = {
        title: title || 'Без названия',
        channelName: user.name,
        channelAvatarUrl: user.avatarUrl,
        views: '0 просмотров',
        postedAt: 'Только что',
        verified: true,
        description: description || '',
        subscribers: '0',
        likes: '0'
      };

      setProgress(5);

      // Загружаем файл в Supabase Storage
      const videoId = await videoService.uploadVideo(file, videoData, (uploadProgress) => {
        const progress = 5 + (uploadProgress * 0.85);
        setProgress(Math.min(progress, 90));
      });
      
      // Финальный прогресс - создание записи в Firestore
      setProgress(100);

      // Небольшая задержка для показа 100%
      setTimeout(() => {
        navigate('/home');
      }, 500);
    } catch (error: any) {
      console.error('Error uploading video:', error);
      
      let errorMessage = "Ошибка при загрузке видео. Попробуйте еще раз.";
      
      if (error?.code === 401 || error?.message?.includes('permission') || error?.message?.includes('access')) {
        errorMessage = "Ошибка: Нет доступа к базе данных. Проверьте настройки Appwrite.";
      } else if (error?.message?.includes('quota') || error?.message?.includes('storage') || error?.code === 413) {
        errorMessage = "Ошибка: Превышен лимит хранилища или файл слишком большой.";
      } else if (error?.message) {
        errorMessage = `Ошибка: ${error.message}`;
      }
      
      alert(errorMessage);
      setIsUploading(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up video blob urls only if they were blob urls
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full min-h-full bg-[#f1f1f1] dark:bg-[#1f1f1f] p-4 md:p-8 flex justify-center">
      <div className="bg-white dark:bg-yt-base w-full max-w-5xl rounded-xl shadow-lg flex flex-col overflow-hidden h-[calc(100vh-100px)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#3f3f3f]">
           <h1 className="text-xl font-bold text-black dark:text-white">
             {step === 'select' ? 'Загрузка контента' : title || 'Загрузка контента'}
           </h1>
           <div className="flex gap-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] rounded-full text-gray-600 dark:text-[#aaa]">
                 <X className="w-6 h-6" />
              </button>
           </div>
        </div>

        {step === 'select' && (
          <div 
            className={`flex-1 flex flex-col items-center justify-center p-10 transition-colors ${dragActive ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
             <div className="w-32 h-32 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
               <UploadIcon className="w-16 h-16 text-gray-400" />
             </div>
             <h2 className="text-black dark:text-white text-lg font-medium mb-2">Перетащите видео или фото сюда</h2>
             <p className="text-gray-500 text-sm mb-6">
                Поддерживаются видео и фото. <br/> 
                <span className="text-xs text-gray-400">Файлы сохраняются в облачном хранилище.</span>
             </p>
             
             <input 
               ref={inputRef} 
               type="file" 
               className="hidden" 
               accept="video/*,image/*" 
               onChange={handleChange} 
             />
             <button 
               onClick={onButtonClick}
               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-sm uppercase text-sm tracking-wide transition-colors"
             >
               Выбрать файлы
             </button>
          </div>
        )}

        {step === 'details' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Сведения</h3>
                

                <div className="mb-6 relative group">
                   <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600 dark:text-[#aaa]">Название (обязательно)</label>
                      <span className="text-xs text-gray-500">{title.length}/100</span>
                   </div>
                   <div className="relative p-3 border border-gray-300 dark:border-[#3f3f3f] rounded-lg focus-within:border-blue-500 transition-colors">
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent outline-none text-black dark:text-white text-sm"
                        placeholder="Добавьте название"
                      />
                   </div>
                </div>

                <div className="mb-8 relative group">
                   <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600 dark:text-[#aaa]">Описание</label>
                      <span className="text-xs text-gray-500">{description.length}/5000</span>
                   </div>
                   <div className="relative p-3 border border-gray-300 dark:border-[#3f3f3f] rounded-lg focus-within:border-blue-500 transition-colors h-32">
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-full bg-transparent outline-none text-black dark:text-white text-sm resize-none"
                        placeholder="Расскажите, о чем ваш контент"
                      />
                   </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-[#aaa] mb-2">Категория</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg p-2 text-sm text-black dark:text-white outline-none"
                      >
                        <option value="1">Развлечения</option>
                        <option value="2">Образование</option>
                        <option value="3">Музыка</option>
                        <option value="4">Игры</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-[#aaa] mb-2">Язык видео</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg p-2 text-sm text-black dark:text-white outline-none"
                      >
                        <option value="ru">Русский</option>
                        <option value="en">Английский</option>
                      </select>
                   </div>
                </div>

                <div className="mb-8">
                   <label className="text-xs font-medium text-gray-600 dark:text-[#aaa] mb-2 block">Теги</label>
                   <input 
                     type="text" 
                     value={tags}
                     onChange={(e) => setTags(e.target.value)}
                     placeholder="Введите теги через запятую"
                     className="w-full bg-transparent border border-gray-300 dark:border-[#3f3f3f] rounded-lg p-2 text-sm text-black dark:text-white outline-none"
                   />
                </div>

                <div className="mb-8 flex items-center justify-between p-4 border border-gray-300 dark:border-[#3f3f3f] rounded-lg">
                   <div>
                      <div className="font-medium text-black dark:text-white text-sm">Монетизация</div>
                      <div className="text-xs text-gray-500">Показывать рекламу в этом видео</div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={monetization}
                        onChange={(e) => setMonetization(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                   </label>
                </div>

                <div className="mb-8">
                   <label className="block text-base font-medium text-black dark:text-white mb-2">Значок</label>
                   <div className="flex gap-4 overflow-x-auto pb-2">
                      <div className="w-32 h-20 bg-gray-200 dark:bg-[#202020] rounded-sm flex items-center justify-center text-xs text-center text-gray-500 p-2 border border-gray-300 dark:border-[#3f3f3f]">
                         {contentType === 'image' ? 'Используется само фото' : 'Генерируется автоматически'}
                      </div>
                   </div>
                </div>
             </div>

             <div className="w-full lg:w-[360px] bg-gray-50 dark:bg-[#181818] p-6 flex flex-col border-l border-gray-200 dark:border-[#3f3f3f]">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-md flex items-center justify-center">
                   {previewUrl ? (
                     contentType === 'video' ? (
                        <video src={previewUrl} controls className="w-full h-full object-contain" />
                     ) : (
                        <img src={previewUrl} className="w-full h-full object-contain" />
                     )
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <FileVideo className="w-8 h-8" />
                     </div>
                   )}
                </div>
                <div className="mb-6">
                   <div className="text-xs text-gray-500 mb-1">Имя файла</div>
                   <div className="text-black dark:text-white text-sm truncate font-medium">{file?.name}</div>
                </div>
             </div>
          </div>
        )}
        
        {step === 'details' && (
           <div className="px-6 py-3 border-t border-gray-200 dark:border-[#3f3f3f] flex items-center justify-between bg-white dark:bg-yt-base">
              <div className="flex flex-col w-1/3">
                 <div className="flex items-center gap-2 text-sm text-black dark:text-white mb-1">
                    {progress < 100 ? `Загрузка ${Math.round(progress)}%` : 'Проверки завершены'}
                    {progress === 100 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                 </div>
                 <div className="w-full h-1 bg-gray-200 dark:bg-[#3f3f3f] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                 </div>
              </div>

              <div className="flex gap-2">
                 <button onClick={() => setStep('select')} className="px-4 py-2 font-medium text-blue-600 uppercase hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                   Назад
                 </button>
                 <button 
                   onClick={() => navigate('/')}
                   className="px-4 py-2 font-medium text-gray-600 hover:text-black dark:text-[#aaa] dark:hover:text-white uppercase transition-colors"
                 >
                   Сохранить черновик
                 </button>
                 <button 
                   onClick={handlePublish}
                   disabled={progress < 100 || isUploading}
                   className="px-6 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 uppercase rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isUploading ? 'Загрузка...' : 'Опубликовать'}
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
