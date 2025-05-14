// frontend/src/components/AlbumCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const AlbumCard = ({ album, onPlayTrack }) => { // Переименовал onPlayAlbum в onPlayTrack для единообразия с App.js
  const defaultCover = '/covers/default_cover.png'; // Убедись, что файл есть

  if (!album || !album.id) { // Добавил проверку на album.id
    return ( // Возвращаем заглушку или null, если данные некорректны
        <div className="album-card opacity-50 p-4 border border-dashed border-spotify-gray-dark rounded-lg flex flex-col items-center justify-center text-center">
            <p className="text-sm text-spotify-gray-light">Ошибка загрузки карточки альбома</p>
        </div>
    );
  }

  const handlePlayClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    // Для AlbumCard мы обычно хотим запустить весь альбом.
    // Функция onPlayTrack в App.js ожидает первый трек и весь плейлист.
    // Если album.tracks не загружен здесь, onPlayTrack должен уметь это обработать
    // (например, загрузить треки альбома по album.id и потом начать воспроизведение).
    // В текущей реализации App.js, onPlayTrack ожидает, что треки уже есть в playlistContext.
    // Поэтому, если мы хотим играть альбом с карточки, нам нужно либо:
    // 1. Передавать album.tracks в AlbumCard (если они загружаются вместе с альбомами для HomePage).
    // 2. Изменить onPlayTrack в App.js, чтобы он мог загружать треки альбома по ID, если их нет.

    // Предположим, что onPlayTrack может принять объект альбома и сам разберется
    // или что HomePage передает альбомы с треками.
    // Если альбом передается без треков, но с ID, и onPlayTrack может это обработать:
    if (onPlayTrack) {
        if (album.tracks && album.tracks.length > 0) {
            const firstPlayableTrack = album.tracks.find(t => t.audio_url && t.audio_url !== '#');
            if (firstPlayableTrack) {
                onPlayTrack(firstPlayableTrack, album.tracks);
            } else {
                console.warn(`AlbumCard: No playable tracks in album ${album.title}`);
            }
        } else {
            // Если треков нет, но есть ID, и onPlayTrack может загрузить их
            // onPlayTrack({ albumIdToLoadAndPlay: album.id }); // Это потребует изменений в App.js
            console.warn(`AlbumCard: Album ${album.title} has no tracks info for immediate playback. Consider loading tracks first or enhancing onPlayTrack.`);
        }
    }
  };
  
  const albumTitle = album.title || 'Без названия';
  const albumArtist = album.artist || 'Неизвестный исполнитель';
  const albumCover = album.cover_url || defaultCover;
  const canPlayAlbumFromCard = album.tracks && album.tracks.length > 0 && album.tracks.some(t => t.audio_url && t.audio_url !== '#');

  return (
    <Link to={`/album/${album.id}`} className="album-card-link group" aria-label={`Перейти к альбому ${albumTitle}`}>
      <div className="album-card">
        <div className="album-card-image-wrapper">
          <img
            src={albumCover}
            alt={`Обложка альбома ${albumTitle}`}
            className="album-card-image"
            loading="lazy"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = defaultCover;
            }}
          />
          {canPlayAlbumFromCard && ( // Показываем кнопку, только если есть что играть
            <button 
              onClick={handlePlayClick}
              className="album-card-play-button"
              aria-label={`Слушать альбом ${albumTitle}`}
              title={`Слушать альбом ${albumTitle}`}
            >
              <Play size={26} fill="black" strokeWidth={0} /> {/* Немного уменьшил иконку */}
            </button>
          )}
        </div>
        <div className="album-card-info">
          <h3 className="album-card-title" title={albumTitle}>
            {albumTitle}
          </h3>
          <p className="album-card-artist" title={albumArtist}>
            {albumArtist}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;
