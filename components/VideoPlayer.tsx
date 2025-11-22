import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, PictureInPicture, SkipForward, Radio } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster: string;
  autoplay?: boolean;
  isLive?: boolean;
  type?: 'video' | 'image';
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, autoplay = false, isLive = false, type = 'video' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  let controlsTimeout: any = null;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) && 
          (e.target === document.body || e.target === containerRef.current)) {
        e.preventDefault();
      }

      switch(e.code) {
        case 'Space':
        case 'KeyK':
          togglePlay();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'ArrowLeft':
          if (!isLive && type === 'video') skip(-5);
          break;
        case 'ArrowRight':
          if (!isLive && type === 'video') skip(5);
          break;
        case 'ArrowUp':
          changeVolume(0.1);
          break;
        case 'ArrowDown':
          changeVolume(-0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted, isFullscreen, isLive, type]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    if (type === 'image') return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLive || type === 'image') return;
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeVolume = (delta: number) => {
    let newVol = volume + delta;
    if (newVol > 1) newVol = 1;
    if (newVol < 0) newVol = 0;
    
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (type === 'image') {
    return (
      <div 
        ref={containerRef}
        className="relative w-full bg-black aspect-video group overflow-hidden rounded-xl shadow-lg flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        <img 
          src={src} 
          alt="Content" 
          className="w-full h-full object-contain"
        />
        
        {/* Simple Overlay for Image controls (Fullscreen only) */}
        <div className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
           <div className="flex items-center justify-end text-white">
              <button onClick={toggleFullscreen} className="hover:bg-white/20 p-2 rounded-full transition-colors" title="Во весь экран">
                {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-black aspect-video group overflow-hidden rounded-xl shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay={autoplay}
      />

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Progress Bar */}
        <div className={`group/slider w-full h-1.5 mb-4 relative ${isLive ? 'cursor-default' : 'cursor-pointer'}`}>
          {!isLive && (
             <input 
               type="range" 
               min="0" 
               max={duration} 
               value={currentTime} 
               onChange={handleSeek}
               className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
             />
          )}
          <div className="w-full h-full bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 relative"
              style={{ width: isLive ? '100%' : `${(currentTime / duration) * 100}%` }}
            >
              {!isLive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover/slider:scale-100 transition-transform" />
              )}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </button>

            {!isLive && (
               <button onClick={() => skip(10)} className="hover:bg-white/20 p-2 rounded-full transition-colors hidden sm:block">
                 <SkipForward className="w-6 h-6" />
               </button>
            )}

            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 accent-white cursor-pointer"
                />
              </div>
            </div>

            <div className="text-sm font-medium flex items-center gap-2">
               {isLive ? (
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-red-500 font-bold">В ЭФИРЕ</span>
                 </div>
               ) : (
                 <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
               )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={togglePiP} className="hover:bg-white/20 p-2 rounded-full transition-colors" title="Картинка в картинке">
              <PictureInPicture className="w-5 h-5" />
            </button>

            <button className="hover:bg-white/20 p-2 rounded-full transition-colors" title="Настройки">
              <Settings className="w-5 h-5" />
            </button>

            <button onClick={toggleFullscreen} className="hover:bg-white/20 p-2 rounded-full transition-colors" title="Во весь экран">
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};