// frontend/src/components/TrackItem.js
import React from 'react';
import { FaPlay, FaPause, FaHeart, FaRegHeart } from 'react-icons/fa'; // Убедитесь, что 'react-icons' установлены
// import './TrackItem.css'; // Удалено

const formatDuration = (ms) => {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) {
    return '0:00';
  }
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const TrackItem = ({ track, trackNumber, onPlay, isPlaying, isCurrentTrack, isFavorite, onToggleFavorite }) => {
  if (!track || typeof track.id === 'undefined') {
    console.warn('[TrackItem] Rendering with invalid track data:', track);
    return (
      <div className="track-item track-item-error"> {/* Предполагается, что эти классы определены в index.css */}
        <div className="track-item-number-play">?</div>
        <div className="track-item-info">
          <span className="track-name">Ошибка данных трека</span>
          <span className="track-artist"></span>
        </div>
        <div className="track-item-duration">--:--</div>
      </div>
    );
  }

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(track);
    } else {
      console.warn('[TrackItem] onPlay handler is not defined');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(track.id);
    } else {
      console.warn('[TrackItem] onToggleFavorite handler is not defined');
    }
  };

  const thisTrackIsPlaying = isCurrentTrack && isPlaying;

  return (
    <div 
      className={`track-item ${isCurrentTrack ? 'active' : ''}`}
      onClick={handlePlayClick} // По клику на строку всегда пытаемся воспроизвести/поставить на паузу
    >
      <div className="track-item-number-play">
        <button onClick={handlePlayClick} className="play-pause-button" aria-label={thisTrackIsPlaying ? "Pause" : "Play"}>
          {thisTrackIsPlaying ? (
            <FaPause className="play-icon" />
          ) : (
            // Если это текущий трек, но он на паузе, показываем Play.
            // Иначе (не текущий трек), показываем номер трека или иконку Play при наведении (стилями).
            isCurrentTrack && !isPlaying ? (
                 <FaPlay className="play-icon" />
            ) : (
                 // Показываем номер трека, если он не текущий и не играет
                 // Иконку Play при наведении можно добавить через CSS :hover псевдокласс
                 <span className="track-number-static">{trackNumber}</span>
            )
          )}
           {/* Иконка Play, которая может появляться при наведении на неактивный трек (управляется CSS) */}
           {!isCurrentTrack && <FaPlay className="play-icon hover-play-icon" />}
        </button>
      </div>
      <div className="track-item-info">
        <span className="track-name">{track.name || 'Без названия'}</span>
        <span className="track-artist">{track.artist_name || track.artist || 'Неизвестный исполнитель'}</span>
      </div>
      <div className="track-item-actions">
        <button onClick={handleFavoriteClick} className="favorite-button" aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          {isFavorite ? <FaHeart className="favorited-icon" /> : <FaRegHeart className="not-favorited-icon" />}
        </button>
      </div>
      <div className="track-item-duration">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
};

export default TrackItem;
