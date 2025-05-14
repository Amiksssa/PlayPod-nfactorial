// PlayPod/frontend/src/pages/AlbumPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlbumById } from '../services/api';
import TrackItem from '../components/TrackItem'; // Убедитесь, что TrackItem импортирован
import { Play, Heart, Clock, ChevronLeft, Music2 } from 'lucide-react'; // MoreHorizontal убрана из этого импорта

const AlbumPage = ({ onPlayTrack, favorites, onToggleFavorite }) => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlbum = async () => {
      setLoading(true);
      setError(null);
      try {
        const albumData = await fetchAlbumById(albumId);
        if (albumData) {
          const tracksWithAlbumInfo = albumData.tracks.map(track => ({
            ...track,
            artist: albumData.artist, // Добавляем артиста альбома к каждому треку
            album_title: albumData.title,
            album_cover_url: albumData.cover_url,
            audio_url: track.audio_url || '#'
          }));
          setAlbum({ ...albumData, tracks: tracksWithAlbumInfo });
        } else {
          setError('Альбом не найден.');
        }
      } catch (err) {
        console.error(`Error loading album ${albumId}:`, err);
        setError('Не удалось загрузить данные альбома.');
      } finally {
        setLoading(false);
      }
    };
    if (albumId) {
      loadAlbum();
    }
  }, [albumId]);

  const handlePlayTrackFromList = (track) => {
    if (onPlayTrack) {
      onPlayTrack(track, album.tracks);
    }
  };
  
  const handlePlayAlbum = () => {
    if (album && album.tracks && album.tracks.length > 0 && onPlayTrack) {
      onPlayTrack(album.tracks[0], album.tracks);
    }
  };

  if (loading) {
    return <div className="loading-message">Загрузка альбома... <Music2 size={28} className="loading-icon"/></div>;
  }

  if (error) {
    return (
      <div className="error-message-container">
        <p>{error}</p>
        <Link to="/" className="back-to-home-link">
          На главную
        </Link>
      </div>
    );
  }

  if (!album) {
    return <div className="text-center text-spotify-gray-light text-xl p-8">Альбом не найден.</div>;
  }

  return (
    <div className="album-page-container">
      <Link to={`/genre/${encodeURIComponent(album.genre)}`} className="album-page-back-link">
        <ChevronLeft size={20} /> {/* Уменьшил иконку */}
        <span>Назад к жанру "{album.genre}"</span>
      </Link>

      <header className="album-page-header">
        <img 
          src={album.cover_url} 
          alt={album.title} 
          className="album-cover-image"
          onError={(e) => e.target.src = 'https://placehold.co/200x200/282828/535353?text=No+Art'}
        />
        <div className="album-info">
          <p className="album-type-label">Альбом</p>
          <h1 className="album-title-main" title={album.title}>{album.title}</h1>
          {/* Можно добавить дополнительную информацию, если есть, например, год */}
          <p className="album-artist-main">
            {album.artist} 
            {album.year && <span className="album-year"> • {album.year}</span>}
          </p>
          <p className="album-meta-main">
            {album.tracks.length} треков
            {/* Можно добавить общую длительность альбома, если она есть */}
          </p>
          <div className="album-actions-main">
            {/* Оставляем только кнопку "Слушать" */}
            <button 
              className="album-play-button-white" 
              onClick={handlePlayAlbum}
              aria-label={`Play album ${album.title}`}
              disabled={album.tracks.length === 0}
            >
              <Play size={20} fill="currentColor" /> {/* Иконка внутри кнопки */}
              <span>Слушать</span>
            </button>
            {/* Кнопки "Избранное" и "Еще" для всего альбома убраны отсюда */}
            {/* Если они нужны, их можно стилизовать по-другому или разместить иначе */}
          </div>
        </div>
      </header>

      <div className="album-tracks-list-section">
        {/* Новый заголовок списка треков */}
        <div className="album-tracks-header-spotify">
          <div className="track-header-spotify-title">Название</div>
          {/* <div className="track-header-spotify-plays">Прослушивания</div>  Пока не реализуем */}
          <div className="track-header-spotify-duration"><Clock size={16} /></div>
        </div>

        {album.tracks && album.tracks.length > 0 ? (
          album.tracks.map((track, index) => ( // index больше не используется для отображения номера
            <TrackItem 
              key={track.id} 
              track={track}
              // index={index} // Передаем, но не отображаем
              onPlay={() => handlePlayTrackFromList(track)} // Передаем функцию для воспроизведения конкретного трека
              isFavorite={favorites.includes(track.id)} 
              onToggleFavorite={() => onToggleFavorite(track.id)} 
            />
          ))
        ) : (
          <p className="album-no-tracks-message">В этом альбоме пока нет треков.</p>
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
