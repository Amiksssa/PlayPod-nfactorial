// PlayPod/frontend/src/components/AlbumCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Music } from 'lucide-react'; 

const AlbumCard = ({ album }) => {
  if (!album) return null;

  // Заглушка для обложки, если ее нет
  const coverUrl = album.cover_url || `https://placehold.co/200x200/282828/ffffff?text=${encodeURIComponent(album.title || 'Album')}`;

  return (
    <Link
      to={`/album/${album.id}`}
      className="album-card-link" // Используем пользовательский класс
    >
      <div className="album-card-image-wrapper">
        <img
          src={coverUrl}
          alt={album.title || 'Album cover'}
          className="album-card-image"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/200x200/282828/ffffff?text=Error`;
          }}
        />
        <button
          className="album-card-play-button"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Добавить логику начала воспроизведения альбома (например, через Context или Redux)
            console.log(`Play album from card: ${album.title}`);
          }}
          aria-label={`Play ${album.title}`}
        >
          <Play size={24} fill="currentColor" />
        </button>
      </div>
      <div className="album-card-info">
        <h3 className="album-card-title" title={album.title}>
          {album.title || 'Без названия'}
        </h3>
        {/* Добавляем информацию об авторе и жанре */}
        <p className="album-card-details">
          <span className="detail-label">Автор:</span> {album.artist || 'Неизвестен'}
        </p>
        <p className="album-card-details">
          <span className="detail-label">Жанр:</span> {album.genre || 'Неизвестен'}
        </p>
      </div>
    </Link>
  );
};

export default AlbumCard;
