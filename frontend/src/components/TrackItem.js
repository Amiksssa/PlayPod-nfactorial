// frontend/src/components/TrackItem.js
import React from 'react';
import { Play, Pause, Heart as HeartIcon, Music2 } from 'lucide-react'; 

const formatDuration = (ms) => {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) return '--:--';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const TrackItem = ({
  track,
  trackNumber,
  onPlay,
  currentTrackId,
  isPlaying,
  isFavorite,
  onToggleFavorite,
}) => {
  // Проверка на валидность трека
  if (!track || typeof track.id === 'undefined') {
    // Можно вернуть null или более информативную заглушку, чтобы не ломать список
    // console.warn("TrackItem: Received invalid track data", track);
    return (
        <div className="track-item-spotify track-item-error opacity-50 cursor-not-allowed">
            <div className="track-item-spotify-play-icon-wrapper text-sm">!</div>
            <div className="track-item-spotify-main-info">
                <span className="track-title-spotify text-red-400">Ошибка данных трека</span>
            </div>
            <div className="track-item-spotify-actions-duration">
                <span className="track-duration-spotify">--:--</span>
            </div>
        </div>
    );
  }

  const isCurrentPlayingTrack = currentTrackId === track.id;
  const hasAudio = track.audio_url && track.audio_url !== '#';

  const handleItemClick = (e) => {
    if (onPlay && hasAudio) {
      onPlay(track); // onPlay теперь должен управлять isPlaying и currentTrack в App.js
    } else if (!hasAudio) {
      console.warn("TrackItem: No audio_url for track", track.title);
      // Можно добавить уведомление пользователю, что трек недоступен
      // Например, через toast-сообщение или изменение состояния
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Предотвращаем клик по всей строке
    if (onToggleFavorite && track.id) { 
      onToggleFavorite(track.id);
    }
  };
  
  const trackTitle = track.name || track.title || "Без названия";
  const trackArtist = track.artist_name || track.artist || "Неизвестный исполнитель";

  return (
    <div
      className={`track-item-spotify group ${isCurrentPlayingTrack ? 'active-track' : ''} ${!hasAudio ? 'no-audio' : ''}`}
      onClick={handleItemClick} 
      role="button"
      tabIndex={hasAudio ? 0 : -1} // Доступность: можно фокусироваться, если есть аудио
      aria-label={hasAudio ? `Слушать ${trackTitle} от ${trackArtist}` : `Трек ${trackTitle} недоступен`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(e); }} // Воспроизведение по Enter/Space
    >
      <div className="track-item-spotify-play-icon-wrapper">
        {!hasAudio ? (
            <Music2 size={16} className="text-spotify-gray-light opacity-70" title="Трек недоступен для прослушивания"/>
        ) : isCurrentPlayingTrack ? (
          isPlaying ? (
            <Pause size={18} className="track-icon text-spotify-white" title="Пауза"/>
          ) : (
            <Play size={18} className="track-icon text-spotify-white" title="Продолжить"/>
          )
        ) : (
          <>
            {/* Номер трека виден по умолчанию, скрывается при наведении на группу (.group-hover:hidden) */}
            <span className="track-number-static group-hover:hidden">{trackNumber}</span>
            {/* Иконка Play видна только при наведении на группу (hidden group-hover:inline-block) */}
            <Play size={18} className="track-icon text-spotify-white hidden group-hover:inline-block" title={`Слушать ${trackTitle}`}/>
          </>
        )}
      </div>

      <div className="track-item-spotify-main-info">
        <span 
            className={`track-title-spotify ${isCurrentPlayingTrack ? 'text-spotify-green' : 'text-spotify-white group-hover:text-spotify-white'}`} 
            title={trackTitle}
        >
          {trackTitle}
        </span>
        <span className="track-artist-spotify" title={trackArtist}>
          {trackArtist}
        </span>
      </div>

      <div className="track-item-spotify-actions-duration">
        {onToggleFavorite && track.id && (
            <button
                onClick={handleFavoriteClick}
                className={`track-action-button track-favorite-button 
                            ${isFavorite ? 'active' : ''} 
                            ${isCurrentPlayingTrack || isFavorite ? 'opacity-100 visible' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}
                aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                tabIndex={0} // Для доступности с клавиатуры
            >
                <HeartIcon size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
        )}
        {/* Длительность: скрывается, если кнопка "сердце" (неактивная) видна при наведении */}
        <span 
            className={`track-duration-spotify 
                        ${(isCurrentPlayingTrack || (isFavorite && onToggleFavorite && track.id)) ? 
                            'opacity-100' : 
                            'group-hover:opacity-0 group-focus-within:opacity-0'
                        }`}
        >
            {formatDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  );
};

export default TrackItem;
