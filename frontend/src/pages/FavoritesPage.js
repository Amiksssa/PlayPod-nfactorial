// frontend/src/pages/FavoritesPage.js
import React from 'react';
import TrackItem from '../components/TrackItem';
import { Heart, Music2, Loader2 } from 'lucide-react';

const FavoritesPage = ({ 
    allTracks, 
    favorites, 
    onToggleFavorite, 
    onPlayTrack, 
    currentTrack, // Получаем весь объект currentTrack
    isPlaying, 
    isLoadingTracks // Состояние загрузки allTracks из App.js
}) => {
  
  const validAllTracks = Array.isArray(allTracks) ? allTracks : [];
  const validFavorites = Array.isArray(favorites) ? favorites : [];

  // Фильтруем и нормализуем треки, которые есть в избранном
  const favoriteTracksDetails = validAllTracks
    .filter(track => track && typeof track.id !== 'undefined' && validFavorites.includes(track.id))
    .map(track => ({ // Нормализация данных для TrackItem, если нужно (хотя allTracks уже должны быть нормализованы в App.js)
        ...track, // Берем все поля из allTracks
        name: track.title || "Без названия", // Гарантируем наличие name
        artist_name: track.artist || "Неизвестный исполнитель", // Гарантируем наличие artist_name
        // album_cover_url уже должен быть в allTracks
    }));

  if (isLoadingTracks && validFavorites.length > 0) { // Показываем загрузку, если треки еще грузятся, но избранные уже есть
    return (
      <div className="loading-message">
        <Loader2 size={48} className="animate-spin text-spotify-green" />
        Загрузка информации о треках...
      </div>
    );
  }
  
  const handlePlayFavoriteTrack = (track) => {
    // Формируем плейлист из всех избранных треков
    // и передаем его вместе с выбранным треком
    if (onPlayTrack && favoriteTracksDetails.length > 0 && track.audio_url && track.audio_url !== '#') {
      onPlayTrack(track, favoriteTracksDetails);
    } else {
        console.warn("Cannot play this favorite track, no audio URL.", track);
    }
  };

  return (
    <div className="favorites-page-container">
      <header className="favorites-header">
        <div className="favorites-icon-background">
          <Heart size={40} className="favorites-icon" fill="currentColor"/> {/* Уменьшил иконку */}
        </div>
        <h1 className="favorites-title">Любимые треки</h1>
      </header>

      {favoriteTracksDetails.length > 0 ? (
        <section className="favorites-tracks-list">
          <div className="album-tracks-header-spotify"> {/* Используем те же классы для консистентности */}
            <div className="text-center">#</div>
            <div className="track-header-spotify-title">Название</div>
            <div className="track-header-spotify-duration">Время</div>
          </div>
          {favoriteTracksDetails.map((track, index) => (
            <TrackItem
              key={track.id || `fav-track-${index}`}
              trackNumber={index + 1}
              track={track} // track уже должен содержать нужные поля (name, artist_name, duration_ms, id, album_cover_url)
              onPlay={() => handlePlayFavoriteTrack(track)}
              currentTrackId={currentTrack ? currentTrack.id : null} // Передаем ID текущего трека
              isPlaying={isPlaying}
              isFavorite={true} // Все треки здесь по определению избранные
              onToggleFavorite={onToggleFavorite} // onToggleFavorite из App.js уже принимает track.id
            />
          ))}
        </section>
      ) : (
        <div className="favorites-empty-message">
          <Music2 size={56} className="text-spotify-gray-light mb-4" /> {/* Уменьшил иконку */}
          <h2 className="text-xl font-semibold text-spotify-white mb-2">Песни, которые вам нравятся</h2>
          <p className="text-sm text-spotify-gray-light">
            Сохраняйте любимые песни, нажимая на сердечко <Heart size={14} className="inline-block text-spotify-gray-light align-baseline" />.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
