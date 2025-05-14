// frontend/src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import {
  SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Volume1,
  Repeat, Heart as HeartIcon
} from 'lucide-react';

const Player = ({
  track,
  isPlaying,
  onTogglePlayPause,
  onNextTrack,
  onPrevTrack,
  favorites,
  onToggleFavorite,
}) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [volume, setVolume] = useState(() => {
    try { return parseFloat(localStorage.getItem('playpod_volume')) || 0.75; }
    catch (e) { return 0.75; }
  });
  const [isMuted, setIsMuted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('playpod_isMuted')) || false; }
    catch (e) { return false; }
  });
  const [isRepeat, setIsRepeat] = useState(() => {
    try { return JSON.parse(localStorage.getItem('playpod_isRepeat')) || false; }
    catch (e) { return false; }
  });

  // Эффект для управления воспроизведением и загрузкой трека
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    if (track.audio_url && track.audio_url !== '#') {
      if (audio.src !== track.audio_url) {
        audio.src = track.audio_url;
        audio.load(); // Важно для смены трека
        setCurrentTime(0); // Сбрасываем время при смене трека
      }
      
      const playPromise = isPlaying ? audio.play() : audio.pause();
      if (playPromise !== undefined && isPlaying) {
        playPromise.catch(error => {
          console.warn("Player: Audio play was interrupted or failed.", error);
          // Если автоплей не сработал, можно обновить состояние isPlaying
          if (onTogglePlayPause) onTogglePlayPause(false); 
        });
      }
    } else {
      audio.pause();
      audio.src = ""; // Сбрасываем src, если трека нет или URL невалидный
      setCurrentTime(0);
      setDuration(0);
    }
  }, [track, isPlaying, onTogglePlayPause]);

  // Эффект для управления громкостью
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      try {
        localStorage.setItem('playpod_volume', volume.toString());
        localStorage.setItem('playpod_isMuted', JSON.stringify(isMuted));
      } catch (e) { console.error("Error saving volume settings to localStorage:", e); }
    }
  }, [volume, isMuted]);

  // Эффект для сохранения режима повтора
  useEffect(() => {
    try {
      localStorage.setItem('playpod_isRepeat', JSON.stringify(isRepeat));
    } catch (e) { console.error("Error saving repeat settings to localStorage:", e); }
  }, [isRepeat]);

  // Эффект для подписки на события аудио элемента
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (isRepeat && track && track.audio_url && track.audio_url !== '#') {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.warn("Player: Error re-playing on repeat", e));
        }
        if(onTogglePlayPause && !isPlaying) onTogglePlayPause(true); // Убедимся, что isPlaying=true
      } else if (onNextTrack) {
        onNextTrack(); 
      } else { // Если нет следующего и не повтор
        if (onTogglePlayPause) onTogglePlayPause(false); 
      }
    };
    
    const handleCanPlay = () => {
      // Этот обработчик может быть полезен для автостарта после загрузки,
      // но основная логика play/pause уже в первом useEffect
      if (isPlaying && track && track.audio_url && track.audio_url !== '#') {
        // audio.play().catch(...); // Уже обрабатывается
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onNextTrack, isRepeat, onTogglePlayPause, isPlaying, track]); // Добавили isPlaying и track

  const handlePlayPauseClick = () => {
    if (onTogglePlayPause) onTogglePlayPause();
  };

  const handleProgressChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current && isFinite(newTime) && duration > 0) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Обновляем состояние для немедленного отклика UI
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
    if (newVolume === 0 && !isMuted) setIsMuted(true);
  };

  const toggleMute = () => {
    const currentlyMuted = isMuted;
    setIsMuted(!currentlyMuted);
    if (currentlyMuted && volume === 0) { 
      setVolume(0.1); // Если был выключен звук и громкость 0, ставим немного
    }
  };
  const toggleRepeatMode = () => setIsRepeat(!isRepeat);

  const isCurrentTrackFavorite = track && Array.isArray(favorites) ? favorites.includes(track.id) : false;

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const trackTitle = track?.title || "Трек не выбран";
  const trackArtist = track?.artist || "";
  const defaultCover = '/covers/default_cover.png'; // Убедись, что файл есть в public/covers
  const coverUrl = track?.cover_url || defaultCover;
  
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : (volume < 0.5 ? Volume1 : Volume2);
  const progressPercentage = duration > 0 && isFinite(duration) && isFinite(currentTime) ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="player-container">
      <audio ref={audioRef} preload="metadata" /> {/* preload="metadata" для быстрой загрузки длительности */}
      
      <div className="player-track-info">
        {track && (
          <img 
            src={coverUrl} 
            alt={trackTitle}
            className="player-track-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = defaultCover; }}
          />
        )}
        <div className="player-track-details">
          <span className="player-track-title" title={trackTitle}>{trackTitle}</span>
          <span className="player-track-artist" title={trackArtist}>{trackArtist}</span>
        </div>
        {track && onToggleFavorite && track.id && (
          <button 
            onClick={() => onToggleFavorite(track.id)}
            className={`player-action-button player-favorite-button ${isCurrentTrackFavorite ? 'active' : ''}`}
            aria-label={isCurrentTrackFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            title={isCurrentTrackFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <HeartIcon size={18} fill={isCurrentTrackFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button onClick={onPrevTrack} disabled={!onPrevTrack} className="player-action-button" aria-label="Предыдущий трек" title="Предыдущий трек"><SkipBack size={20} fill="currentColor" /></button>
          <button 
            onClick={handlePlayPauseClick} 
            className="player-play-button"
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
            title={isPlaying ? "Пауза" : "Воспроизвести"}
            disabled={!track || !track.audio_url || track.audio_url === '#'}
          >
            {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
          </button>
          <button onClick={onNextTrack} disabled={!onNextTrack} className="player-action-button" aria-label="Следующий трек" title="Следующий трек"><SkipForward size={20} fill="currentColor" /></button>
          <button onClick={toggleRepeatMode} className={`player-action-button ${isRepeat ? 'active' : ''}`} aria-label="Повторять трек" title="Повторять трек"><Repeat size={18} /></button>
        </div>
        <div className="player-progress-bar-container">
          <span className="player-time">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max="100" // Всегда от 0 до 100 для процента
            value={progressPercentage}
            onChange={handleProgressChange}
            disabled={!track || !track.audio_url || track.audio_url === '#' || !isFinite(duration) || duration === 0}
            className="player-progress-slider"
            aria-label="Прогресс трека"
            style={{'--progress-percent': `${progressPercentage}%`}} // Для стилизации заполнения
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-extra-controls">
        <button onClick={toggleMute} className="player-action-button" aria-label={isMuted ? "Включить звук" : "Выключить звук"} title={isMuted ? "Включить звук" : "Выключить звук"}>
          <VolumeIcon size={20} />
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="player-volume-slider"
          aria-label="Громкость"
          style={{'--volume-percent': `${(isMuted ? 0 : volume) * 100}%`}} // Для стилизации заполнения
        />
      </div>
    </footer>
  );
};

export default Player;
