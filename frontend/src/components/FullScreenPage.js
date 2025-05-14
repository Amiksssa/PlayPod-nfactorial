// PlayPod/frontend/src/components/FullScreenPlayer.js
import React from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from 'lucide-react';

const FullScreenPlayer = ({
  track,
  isPlaying,
  progress, // процент от 0 до 100
  duration, // в секундах
  currentTime, // в секундах
  onTogglePlayPause,
  onNextTrack,
  onPrevTrack,
  onSeek, // функция для перемотки (принимает новое время в секундах)
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  if (!track) return null;

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    if (onSeek && duration > 0) {
        const newTime = (parseFloat(e.target.value) / 100) * duration;
        onSeek(newTime);
    }
  };

  return (
    <div className="fixed inset-0 bg-spotify-gray-dark bg-opacity-95 backdrop-blur-lg z-[100] flex flex-col items-center justify-center p-4 text-spotify-white">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-spotify-gray-light hover:text-spotify-white"
        aria-label="Закрыть плеер"
      >
        <X size={32} />
      </button>

      <div className="flex flex-col items-center w-full max-w-md">
        <img
          src={track.cover_url}
          alt={track.title}
          className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-2xl mb-6"
          onError={(e) => e.target.src = 'https://placehold.co/320x320/282828/535353?text=Error'}
        />
        <h2 className="text-3xl font-bold mb-1 text-center truncate w-full" title={track.title}>{track.title}</h2>
        <p className="text-lg text-spotify-gray-light mb-6 text-center truncate w-full" title={track.artist}>{track.artist}</p>

        {/* Прогресс-бар */}
        <div className="w-full mb-6">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-spotify-gray-medium rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-spotify-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full"
          />
          <div className="flex justify-between text-xs text-spotify-gray-light mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Элементы управления */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <button onClick={() => onToggleFavorite(track.id)} className={`p-2 ${isFavorite ? 'text-spotify-green' : 'text-spotify-gray-light hover:text-spotify-white'}`} aria-label="Избранное">
            <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'}/>
          </button>
          <button onClick={onPrevTrack} className="text-spotify-gray-light hover:text-spotify-white p-2" aria-label="Предыдущий трек">
            <SkipBack size={28} fill="currentColor"/>
          </button>
          <button
            onClick={onTogglePlayPause}
            className="bg-spotify-green text-spotify-black rounded-full p-4 w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor"/>}
          </button>
          <button onClick={onNextTrack} className="text-spotify-gray-light hover:text-spotify-white p-2" aria-label="Следующий трек">
            <SkipForward size={28} fill="currentColor"/>
          </button>
          <button className="text-spotify-gray-light hover:text-spotify-white p-2" aria-label="Повтор"> {/* TODO: Добавить isRepeat */}
            <Repeat size={24} />
          </button>
        </div>
        {/* Можно добавить управление громкостью, если нужно */}
      </div>
    </div>
  );
};

export default FullScreenPlayer;
