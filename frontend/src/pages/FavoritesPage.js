// PlayPod/frontend/src/pages/FavoritesPage.js
import React from 'react';
import TrackItem from '../components/TrackItem';
import { Heart, Music } from 'lucide-react';

const FavoritesPage = ({ allTracks, favorites, onToggleFavorite, onPlayTrack }) => {
  
  const favoriteTracksDetails = allTracks.filter(track => favorites.includes(track.id));

  if (!allTracks || allTracks.length === 0) {
      return <div className="flex justify-center items-center h-full text-xl">Загрузка треков... <Music size={28} className="ml-2 animate-pulse"/></div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <Heart size={36} className="text-spotify-green mr-4" fill="currentColor"/>
        <h1 className="text-4xl font-bold text-spotify-white">Любимые треки</h1>
      </div>

      {favoriteTracksDetails.length > 0 ? (
        <div className="space-y-2">
          {/* Заголовок списка треков */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[40px_minmax(0,4fr)_minmax(0,2fr)_minmax(0,1fr)_60px] items-center gap-4 px-3 py-2 border-b border-spotify-gray-medium text-spotify-gray-light text-xs uppercase tracking-wider mb-2">
            <div className="text-center">#</div>
            <div>Название</div>
            <div className="hidden md:block">Альбом</div>
            <div className="justify-self-end pr-4">Время</div> {/* Можно использовать иконку Clock */}
            <div className="w-[60px]"></div> {/* Пустое место для иконок действий */}
          </div>
          {favoriteTracksDetails.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              onPlay={onPlayTrack} // Передаем функцию для воспроизведения
              isFavorite={favorites.includes(track.id)} // Передаем статус избранного
              onToggleFavorite={() => onToggleFavorite(track.id)} // Передаем функцию для изменения статуса
            />
          ))}
        </div>
      ) : (
        <p className="text-spotify-gray-light text-lg text-center mt-10">
          У вас пока нет любимых треков. Нажмите сердечко <Heart size={18} className="inline text-spotify-gray-light"/> рядом с треком, чтобы добавить его сюда.
        </p>
      )}
    </div>
  );
};

export default FavoritesPage;
