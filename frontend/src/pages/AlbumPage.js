// frontend/src/pages/AlbumPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAlbumById } from '../services/api'; // Изменено: getAlbumById -> fetchAlbumById
import TrackItem from '../components/TrackItem';
// import './AlbumPage.css'; // Удалено

const AlbumPage = ({ onPlayTrack, favorites: favoritesProp, onToggleFavorite }) => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('[AlbumPage Render Start] Received favoritesProp:', favoritesProp, 'Is favoritesProp an array?', Array.isArray(favoritesProp));

  const favorites = Array.isArray(favoritesProp) ? favoritesProp : [];
  console.log('[AlbumPage Render Start] Internal "favorites" (after ensuring array):', favorites, 'Is it an array?', Array.isArray(favorites));

  useEffect(() => {
    console.log("[AlbumPage useEffect for favoritesProp] favoritesProp:", favoritesProp, "Type:", typeof favoritesProp, "IsArray:", Array.isArray(favoritesProp));
    if (typeof favoritesProp === 'undefined') {
      console.error("ALBUM_PAGE_ERROR (useEffect): 'favoritesProp' is UNDEFINED. Check App.js prop passing.");
    } else if (!Array.isArray(favoritesProp)) {
      console.warn("ALBUM_PAGE_WARNING (useEffect): 'favoritesProp' is defined but NOT an array. Value:", favoritesProp);
    }
  }, [favoritesProp]);

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`[AlbumPage] Fetching album with ID: ${albumId}`);
        const albumData = await fetchAlbumById(albumId); // Изменено: getAlbumById -> fetchAlbumById

        if (albumData && albumData.tracks) {
          const tracksWithAlbumInfo = albumData.tracks
            .filter(track => track && typeof track.id !== 'undefined')
            .map(track => ({
              ...track,
              album: {
                id: albumData.id,
                name: albumData.name,
                artist: albumData.artist,
                cover_art_url: albumData.cover_art_url
              },
              artist_name: track.artist || albumData.artist,
              album_name: albumData.name,
              cover_art_url: track.cover_art_url || albumData.cover_art_url,
              duration_ms: typeof track.duration_ms === 'number' ? track.duration_ms : 220000
            }));
          setAlbum({ ...albumData, tracks: tracksWithAlbumInfo });
          console.log('[AlbumPage] Album data loaded and processed:', { ...albumData, tracks: tracksWithAlbumInfo });
        } else {
          console.error('[AlbumPage] Fetched album data is invalid or has no tracks:', albumData);
          setError('Альбом не найден или не содержит треков.');
        }
      } catch (err) {
        console.error('[AlbumPage] Error loading album:', err);
        setError(err.message || 'Ошибка загрузки альбома.');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      loadAlbum();
    } else {
      console.error('[AlbumPage] albumId is undefined.');
      setError('Не указан ID альбома.');
      setLoading(false);
    }
  }, [albumId]);

  const handlePlayTrackFromList = (track) => {
    if (onPlayTrack && track && album) {
      onPlayTrack(track, track.cover_art_url || album.cover_art_url, album.primary_color || '#121212');
    } else {
      console.warn('[AlbumPage] Could not play track. Missing onPlayTrack, track, or album info.', { track, album });
    }
  };

  if (loading) {
    return <div className="album-loading-message">Загрузка данных альбома...</div>;
  }
  if (error) {
    return <div className="album-error-message">Ошибка: {error}</div>;
  }
  if (!album) {
    return <div className="album-no-data-message">Информация об альбоме не загружена.</div>;
  }
  if (!Array.isArray(album.tracks)) {
    console.error('[AlbumPage] album.tracks is not an array after loading!', album.tracks);
    return <div className="album-error-message">Ошибка: Треки альбома загружены некорректно.</div>;
  }

  const currentFavoritesToUse = favorites;
  console.log('[AlbumPage] Before rendering tracks, currentFavoritesToUse:', currentFavoritesToUse, 'Is it an array?', Array.isArray(currentFavoritesToUse));

  return (
    <div className="album-page-container">
      <div className="album-header">
        <img src={album.cover_art_url || '/placeholder-album-art.png'} alt={album.name} className="album-cover-art-large" />
        <div className="album-info">
          <h1>{album.name}</h1>
          <p className="album-artist">{album.artist}</p>
          <p className="album-meta">{album.release_year || 'N/A'} • {album.tracks.length} треков</p>
        </div>
      </div>

      <div className="album-track-list">
        {album.tracks.length === 0 ? (
          <p>В этом альбоме нет треков.</p>
        ) : (
          album.tracks.map((track, index) => {
            if (!track || typeof track.id === 'undefined') {
              console.warn(`[AlbumPage Map Item - Index ${index}] Invalid track data or missing track.id. Skipping. Track:`, track);
              return null;
            }

            console.log(`[AlbumPage Map Item - Index ${index}] Track ID:`, track.id, 'Value of currentFavoritesToUse before .includes():', currentFavoritesToUse);
            
            let isFav = false;
            try {
              if (!Array.isArray(currentFavoritesToUse)) {
                console.error(`[AlbumPage Map Item - Index ${index}] CRITICAL! currentFavoritesToUse is NOT AN ARRAY right before .includes()! Value:`, currentFavoritesToUse);
              } else {
                isFav = currentFavoritesToUse.includes(track.id);
              }
            } catch (e) {
              console.error(`[AlbumPage Map Item - Index ${index}] Error during .includes() call! Track ID: ${track.id}, currentFavoritesToUse:`, currentFavoritesToUse, "Error:", e);
            }
            
            return (
              <TrackItem
                key={track.id}
                trackNumber={index + 1}
                track={track}
                onPlay={() => handlePlayTrackFromList(track)}
                isFavorite={isFav}
                onToggleFavorite={() => {
                  if (onToggleFavorite) {
                    onToggleFavorite(track.id);
                  } else {
                    console.warn("[AlbumPage] onToggleFavorite is not defined for TrackItem");
                  }
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
