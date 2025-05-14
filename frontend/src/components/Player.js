// PlayPod/frontend/src/components/Player.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
// Импортируем только нужные иконки из lucide-react
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic, // Если вы используете кнопку "Очередь"
  Heart,    // Если вы используете кнопку "Избранное" в плеере
  Maximize2 // Если вы используете кнопку "Развернуть"
} from 'lucide-react';

// Принимаем пропсы из App.js
const Player = ({
  track,
  isPlaying,
  onTogglePlayPause, // Функция для управления play/pause из App.js
  onNextTrack,
  onPrevTrack,
  favorites,         // Список ID избранных треков
  onToggleFavorite   // Функция для добавления/удаления из избранного
  // onToggleFullScreenPlayer, // Если вы реализуете полноэкранный плеер
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false); // Логика для shuffle должна быть в App.js

  const audioRef = useRef(null);

  // Эффект для управления play/pause на основе isPlaying из App.js
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && track && track.audio_url && track.audio_url !== '#') {
        audioRef.current.play().catch(e => console.error("Error playing audio in Player.js:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track]);

  // Загрузка нового трека
  useEffect(() => {
    if (audioRef.current && track && track.audio_url) {
      if (audioRef.current.src !== track.audio_url) {
        audioRef.current.src = track.audio_url;
        audioRef.current.load(); // Загружаем новый трек
        // Воспроизведение начнется благодаря эффекту выше, если isPlaying true
      }
    } else if (audioRef.current) {
        // Если трека нет или URL некорректный, останавливаем и сбрасываем
        audioRef.current.pause();
        audioRef.current.src = ""; 
        setCurrentTime(0);
        setDuration(0);
        setProgress(0);
        if (onTogglePlayPause) onTogglePlayPause(false); // Убедимся, что isPlaying тоже false
    }
  }, [track, onTogglePlayPause]);


  // Управление громкостью и Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Слушатели событий аудио элемента
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        if (onTogglePlayPause) onTogglePlayPause(true); // Запускаем снова
      } else if (onNextTrack) {
        onNextTrack(); // onNextTrack должен также установить isPlaying в true в App.js
      } else {
        // Если нет следующего трека и не включен повтор, останавливаем
        if (onTogglePlayPause) onTogglePlayPause(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    // Слушатели для play/pause не нужны здесь, так как isPlaying управляется извне

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onNextTrack, isRepeat, onTogglePlayPause]); // Добавлен onTogglePlayPause в зависимости

  // Обновление ползунка прогресса
  useEffect(() => {
    if (duration > 0 && isFinite(duration)) { // Проверка на isFinite для избежания NaN
      setProgress((currentTime / duration) * 100);
    } else {
      setProgress(0);
    }
  }, [currentTime, duration]);

  const handleInternalTogglePlayPause = () => {
    if (!track || !track.audio_url || track.audio_url === '#') return;
    if (onTogglePlayPause) {
      onTogglePlayPause(); // Вызываем функцию из App.js для изменения глобального isPlaying
    }
  };

  const handleProgressChange = (e) => {
    const newProgressValue = parseFloat(e.target.value);
    if (audioRef.current && duration > 0 && isFinite(duration)) {
      const newTime = (newProgressValue / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Обновляем currentTime немедленно
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false); // Если меняем громкость, снимаем mute
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle); // Логика для shuffle должна быть в App.js

  const handleFavoriteClick = () => {
    if (track && onToggleFavorite) {
      onToggleFavorite(track.id);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0 || !isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Данные для отображения, если трек не выбран
  const currentTrackData = track || {
    title: "Выберите трек",
    artist: "Исполнитель",
    cover_url: "https://placehold.co/64x64/181818/535353?text=Play", // Заглушка для обложки
    audio_url: null, // Важно, чтобы audio_url был null или пуст, если трека нет
    album_title: ""
  };

  const isCurrentFavorite = track && favorites ? favorites.includes(track.id) : false;

  return (
    // Используем класс player-container из index.css
    <footer className="player-container">
      <audio ref={audioRef} /> {/* HTML5 аудио элемент */}
      
      {/* Левая часть: информация о треке */}
      <div className="player-track-info">
        {currentTrackData.audio_url && currentTrackData.audio_url !== '#' && (
            <img 
                src={currentTrackData.cover_url} 
                alt={currentTrackData.title}
            />
        )}
        <div className="player-track-details">
          <span className="player-track-title">{currentTrackData.title}</span>
          <span className="player-track-artist">{currentTrackData.artist}</span>
        </div>
        {currentTrackData.audio_url && currentTrackData.audio_url !== '#' && onToggleFavorite && (
            <button 
                onClick={handleFavoriteClick}
                className={`player-favorite-button ${isCurrentFavorite ? 'active' : ''}`}
                aria-label={isCurrentFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
                <Heart size={18} fill={isCurrentFavorite ? "currentColor" : "none"} />
            </button>
        )}
      </div>

      {/* Центральная часть: управление воспроизведением */}
      <div className="player-controls">
        <div className="player-buttons">
          <button onClick={toggleShuffle} className={isShuffle ? 'active' : ''} aria-label="Перемешать">
            <Shuffle size={18} />
          </button>
          <button onClick={onPrevTrack} disabled={!onPrevTrack} aria-label="Предыдущий трек">
            <SkipBack size={22} />
          </button>
          <button 
            onClick={handleInternalTogglePlayPause} 
            className="player-play-button"
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
            disabled={!currentTrackData.audio_url || currentTrackData.audio_url === '#'}
          >
            {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}
          </button>
          <button onClick={onNextTrack} disabled={!onNextTrack} aria-label="Следующий трек">
            <SkipForward size={22} />
          </button>
          <button onClick={toggleRepeat} className={isRepeat ? 'active' : ''} aria-label="Повторять">
            <Repeat size={18} />
          </button>
        </div>
        <div className="player-progress-bar-container">
          <span className="player-time">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isNaN(progress) ? 0 : progress} // Защита от NaN
            onChange={handleProgressChange}
            disabled={!currentTrackData.audio_url || currentTrackData.audio_url === '#'}
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Правая часть: управление громкостью и др. */}
      <div className="player-volume-controls">
        {/* <button aria-label="Очередь"><ListMusic size={18} /></button> */}
        <button onClick={toggleMute} aria-label={isMuted ? "Включить звук" : "Выключить звук"}>
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          aria-label="Громкость"
        />
        {/* <button aria-label="Развернуть"><Maximize2 size={18} /></button> */}
      </div>
    </footer>
  );
};

export default Player;
