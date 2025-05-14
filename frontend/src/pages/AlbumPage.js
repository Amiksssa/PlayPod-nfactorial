import React, { useState, useEffect } from 'react'; // <<< ВАЖНО: Импорт React, useState, useEffect
import { useParams, Link } from 'react-router-dom'; // <<< ВАЖНО: Импорт useParams и Link
import { fetchAlbumById } from '../services/api';    // <<< ВАЖНО: Импорт вашей функции API
import TrackItem from '../components/TrackItem';      // <<< ВАЖНО: Импорт TrackItem
import { Play, Clock, ChevronLeft, Music2 } from 'lucide-react'; // Heart убран, он в TrackItem

const AlbumPage = ({ onPlayTrack, favorites, onToggleFavorite }) => {
  const { albumId } = useParams(); // Теперь useParams определен
  const [album, setAlbum] = useState(null); // Теперь useState определен
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { // Теперь useEffect определен
    // console.log("AlbumPage received 'favorites' prop:", favorites, "Type:", typeof favorites, "IsArray:", Array.isArray(favorites));
    if (typeof favorites === 'undefined') {
      console.error("ALBUM_PAGE_ERROR: 'favorites' prop is UNDEFINED. Check App.js prop passing.");
    } else if (!Array.isArray(favorites)) {
      console.warn("ALBUM_PAGE_WARNING: 'favorites' prop is defined but NOT an array. Value:", favorites);
    }
  }, [favorites]);

  useEffect(() => { // Теперь useEffect определен
    const loadAlbum = async () => {
      setLoading(true); setError(null);
      try {
        const albumData = await fetchAlbumById(albumId); // Теперь fetchAlbumById определен
        if (albumData && Array.isArray(albumData.tracks)) {
          const tracksWithAlbumInfo = albumData.tracks.map(track => ({
            ...track, artist: albumData.artist, album_title: albumData.title,
            album_cover_url: albumData.cover_url, audio_url: track.audio_url || '#',
            duration_ms: track.duration_ms || 220000
          }));
          setAlbum({ ...albumData, tracks: tracksWithAlbumInfo });
        } else {
          setError(albumData ? 'В альбоме нет треков или данные некорректны.' : 'Альбом не найден.');
          setAlbum(null);
        }
      } catch (err) {
        console.error(`Error loading album ${albumId}:`, err);
        setError('Не удалось загрузить данные альбома.'); setAlbum(null);
      } finally { setLoading(false); }
    };
    if (albumId) loadAlbum();
  }, [albumId]);

  const handlePlayTrackFromList = (track) => {
    if (onPlayTrack && album && Array.isArray(album.tracks)) {
      onPlayTrack(track, album.tracks);
    }
  };
  
  const handlePlayAlbum = () => {
    if (album && Array.isArray(album.tracks) && album.tracks.length > 0 && onPlayTrack) {
      onPlayTrack(album.tracks[0], album.tracks);
    }
  };

  if (loading) return <div className="loading-message">Загрузка альбома... <Music2 size={28} className="loading-icon"/></div>;
  if (error) return <div className="error-message-container"><p>{error}</p><Link to="/" className="back-to-home-link">На главную</Link></div>; // Теперь Link определен
  if (!album || !Array.isArray(album.tracks)) return <div className="album-no-tracks-message">Информация об альбоме не загружена.</div>;

  // Гарантируем, что favorites является массивом ПЕРЕД использованием .includes
  const currentFavoritesToUse = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="album-page-container">
      <Link to={`/genre/${encodeURIComponent(album.genre || 'unknown')}`} className="album-page-back-link"> {/* Теперь Link определен */}
        <ChevronLeft size={20} /> 
        <span>Назад к жанру "{album.genre || 'Неизвестный жанр'}"</span>
      </Link>
      <header className="album-page-header">
        <img src={album.cover_url} alt={album.title} className="album-cover-image" onError={(e) => e.target.src = 'https://placehold.co/200x200/282828/535353?text=No+Art'}/>
        <div className="album-info">
          <p className="album-type-label">Альбом</p>
          <h1 className="album-title-main" title={album.title}>{album.title}</h1>
          <p className="album-artist-main">{album.artist} {album.year && <span className="album-year"> • {album.year}</span>}</p>
          <p className="album-meta-main">{album.tracks.length} треков</p>
          <div className="album-actions-main">
            <button className="album-play-button-white" onClick={handlePlayAlbum} aria-label={`Play album ${album.title}`} disabled={album.tracks.length === 0}>
              <Play size={20} fill="currentColor" /> <span>Слушать</span>
            </button>
          </div>
        </div>
      </header>
      <div className="album-tracks-list-section">
        <div className="album-tracks-header-spotify">
          <div className="track-header-spotify-play-icon"></div>
          <div className="track-header-spotify-title">Название</div>
          <div className="track-header-spotify-duration"><Clock size={16} /></div>
        </div>
        {album.tracks.length > 0 ? (
          album.tracks.map((track) => {
            // Используем currentFavoritesToUse, который гарантированно является массивом
            const isFav = track && typeof track.id !== 'undefined' 
                          ? currentFavoritesToUse.includes(track.id) 
                          : false;
            
            return (
              <TrackItem 
                key={track.id} 
                track={track}
                onPlay={() => handlePlayTrackFromList(track)}
                isFavorite={isFav} 
                onToggleFavorite={() => {
                  if (onToggleFavorite && typeof onToggleFavorite === 'function') {
                    if (track && typeof track.id !== 'undefined') {
                        onToggleFavorite(track.id);
                    } else {
                        console.error("TrackItem: Cannot toggle favorite, track.id is undefined for track:", track);
                    }
                  } else {
                    console.error("AlbumPage/TrackItem: onToggleFavorite prop is not a function or not provided.");
                  }
                }}
              />
            );
          })
        ) : (<p className="album-no-tracks-message">В этом альбоме пока нет треков.</p>)}
      </div>
    </div>
  );
};

export default AlbumPage; // <<< ВАЖНО: Экспорт по умолчанию
