// PlayPod/frontend/src/App.js
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
    let savedFavoritesValue = null;
    try {
      savedFavoritesValue = localStorage.getItem('playpod_favorites');
      if (savedFavoritesValue) {
        const parsedFavorites = JSON.parse(savedFavoritesValue);
        if (Array.isArray(parsedFavorites)) {
          // console.log("App.js: Loaded 'favorites' from localStorage:", parsedFavorites);
          return parsedFavorites;
        }
        // console.warn("App.js: 'favorites' from localStorage is not an array, defaulting to []. Value:", parsedFavorites);
      }
    } catch (e) {
      console.error("App.js: Failed to parse 'favorites' from localStorage, defaulting to []. Error:", e);
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
    // console.log("App.js: 'favorites' state changed. Current favorites:", favorites, "IsArray:", Array.isArray(favorites));
    if (Array.isArray(favorites)) {
      localStorage.setItem('playpod_favorites', JSON.stringify(favorites));
    } else {
      // Эта ситуация не должна возникать, если setFavorites всегда получает массив.
      // Но на всякий случай, если favorites каким-то образом стал не массивом, логируем и сбрасываем.
      console.error("App.js: CRITICAL - 'favorites' state is NOT an array during save! Value:", favorites, "Forcing to empty array.");
      setFavorites([]); // Принудительный сброс в пустой массив
    }
  }, [favorites]);

  const toggleFavorite = useCallback((trackId) => {
    setFavorites(prevFavorites => {
      // Гарантируем, что prevFavorites это массив перед использованием .includes
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

  // console.log("App.js rendering Routes. Passing 'favorites' prop with value:", favorites, "Is it an array?", Array.isArray(favorites));

  return (
    <div className="app-container">
      <div className="app-main-content-area">
        <Sidebar />
        <MainView>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
            <Route path="/genre/:genreName" element={<GenrePage />} />
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
          onTogglePlayPause={handleTogglePlayPause}
          onNextTrack={playNextTrack}
          onPrevTrack={playPrevTrack}
          favorites={favorites} 
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
export default App;
