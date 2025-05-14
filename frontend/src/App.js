import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import Player from './components/Player';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import GenrePage from './pages/GenrePage';
import FavoritesPage from './pages/FavoritesPage';
import { fetchTracks as fetchAllTracksFromApi } from './services/api';

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    // console.log("App.js: Initializing 'favorites' state...");
    const savedFavorites = localStorage.getItem('playpod_favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          // console.log("App.js: Loaded 'favorites' from localStorage:", parsedFavorites);
          return parsedFavorites;
        }
        // console.warn("App.js: 'favorites' from localStorage is not an array, defaulting to []. Value:", parsedFavorites);
      } catch (e) {
        console.error("App.js: Failed to parse 'favorites' from localStorage, defaulting to []. Error:", e);
      }
    }
    // console.log("App.js: No valid 'favorites' in localStorage or parse error, defaulting to [].");
    return []; // Гарантированно возвращаем массив
  });

  const [allTracks, setAllTracks] = useState([]);

  useEffect(() => {
    const loadAllTracks = async () => {
      try {
        const tracksData = await fetchAllTracksFromApi({});
        setAllTracks(Array.isArray(tracksData) ? tracksData : []);
      } catch (error) {
        console.error("Failed to load all tracks in App.js:", error);
        setAllTracks([]);
      }
    };
    loadAllTracks();
  }, []);

  useEffect(() => {
    // console.log("App.js: 'favorites' state changed. Attempting to save. Current favorites:", favorites, "IsArray:", Array.isArray(favorites));
    if (Array.isArray(favorites)) { 
      localStorage.setItem('playpod_favorites', JSON.stringify(favorites));
    } else {
      console.error("App.js: CRITICAL - 'favorites' state became NON-ARRAY during an update! Value:", favorites, "Forcing to empty array.");
      setFavorites([]); 
    }
  }, [favorites]);

  const toggleFavorite = useCallback((trackId) => {
    setFavorites(prevFavorites => {
      const currentFavorites = Array.isArray(prevFavorites) ? prevFavorites : [];
      if (currentFavorites.includes(trackId)) {
        return currentFavorites.filter(id => id !== trackId);
      } else {
        return [...currentFavorites, trackId];
      }
    });
  }, []);

  const playTrack = useCallback((track, albumTracks = null) => {
    let newPlaylist = [];
    let trackToPlay = null;
    let trackIndexInPlaylist = -1;

    const normalizeTrack = (t, albumInfo = {}) => ({
        id: t.id,
        title: t.title || "Без названия",
        artist: t.artist || albumInfo.artist || 'Неизвестный исполнитель',
        album_title: t.album_title || albumInfo.title || 'Неизвестный альбом',
        cover_url: t.album_cover_url || t.cover_url || albumInfo.cover_url || `https://placehold.co/64x64/181818/535353?text=${encodeURIComponent(t.title || 'Play')}`,
        audio_url: t.audio_url || '#',
        features: t.features,
        duration_ms: t.duration_ms || 220000 
    });

    if (albumTracks && Array.isArray(albumTracks) && albumTracks.length > 0) {
      const firstTrackInAlbum = albumTracks[0] || {};
      const albumInfoForNormalization = {
          artist: firstTrackInAlbum.artist,
          title: firstTrackInAlbum.album_title,
          cover_url: firstTrackInAlbum.album_cover_url
      };
      newPlaylist = albumTracks.map(t => normalizeTrack(t, albumInfoForNormalization));
      const targetTrackId = track && typeof track.id !== 'undefined' ? track.id : (newPlaylist.length > 0 && newPlaylist[0] ? newPlaylist[0].id : null);
      trackIndexInPlaylist = newPlaylist.findIndex(t => t && t.id === targetTrackId);
      
      if (trackIndexInPlaylist === -1 && newPlaylist.length > 0) trackIndexInPlaylist = 0;
      trackToPlay = newPlaylist[trackIndexInPlaylist];
    } else if (track) {
      trackToPlay = normalizeTrack(track);
      newPlaylist = [trackToPlay];
      trackIndexInPlaylist = 0;
    } else {
      setCurrentTrack(null); setPlaylist([]); setCurrentTrackIndex(-1); setIsPlaying(false);
      return;
    }
    
    setPlaylist(newPlaylist);
    setCurrentTrackIndex(trackIndexInPlaylist);
    setCurrentTrack(trackToPlay);
    if (trackToPlay && trackToPlay.audio_url && trackToPlay.audio_url !== '#') {
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  }, []);

  const playNextTrack = useCallback(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    if (playlist[nextIndex] && playlist[nextIndex].audio_url && playlist[nextIndex].audio_url !== '#') {
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  }, [playlist, currentTrackIndex]);

  const playPrevTrack = useCallback(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    if (playlist[prevIndex] && playlist[prevIndex].audio_url && playlist[prevIndex].audio_url !== '#') {
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  }, [playlist, currentTrackIndex]);

  const handleTogglePlayPause = useCallback((shouldPlay) => {
      if (currentTrack && currentTrack.audio_url && currentTrack.audio_url !== '#') {
        setIsPlaying(prevIsPlaying => typeof shouldPlay === 'boolean' ? shouldPlay : !prevIsPlaying);
      } else {
        setIsPlaying(false);
      }
  }, [currentTrack]);

  return (
    <div className="app-container"> {/* ОБЩИЙ КОНТЕЙНЕР ПРИЛОЖЕНИЯ */}
      <div className="app-main-content-area"> {/* КОНТЕЙНЕР ДЛЯ САЙДБАРА И ОСНОВНОГО КОНТЕНТА */}
        <Sidebar />
        <MainView>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* HomePage не нужны эти пропсы */}
            <Route 
              path="/album/:albumId" 
              element={
                <AlbumPage 
                  onPlayTrack={playTrack} 
                  favorites={favorites} // favorites ПЕРЕДАЕТСЯ ЗДЕСЬ
                  onToggleFavorite={toggleFavorite} 
                />
              } 
            />
            <Route path="/genre/:genreName" element={<GenrePage />} /> {/* GenrePage не нужны эти пропсы */}
            <Route 
              path="/favorites" 
              element={
                <FavoritesPage 
                  allTracks={allTracks} 
                  favorites={favorites} 
                  onToggleFavorite={toggleFavorite} 
                  onPlayTrack={playTrack} 
                />
              } 
            />
          </Routes>
        </MainView>
      </div>
      {currentTrack && (
        <Player
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlayPause={handleTogglePlayPause} // Правильное имя пропа
          onNextTrack={playNextTrack}
          onPrevTrack={playPrevTrack}
          favorites={favorites} 
          onToggleFavorite={toggleFavorite}
          // audioRef и onEnded не передаются, т.к. Player управляет своим audioRef
          // onFullScreen не реализован в этой версии Player
        />
      )}
    </div>
  );
}
export default App;
