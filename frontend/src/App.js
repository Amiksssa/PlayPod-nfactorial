// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
// Убираем BrowserRouter as Router, так как он теперь в index.js
import { Routes, Route } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import GenrePage from './pages/GenrePage';
import FavoritesPage from './pages/FavoritesPage';
import Player from './components/Player';
import { fetchAllTracksFromApi } from './services/api'; 
import './index.css'; 

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('playpod_favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          return parsedFavorites;
        }
      } catch (e) {
        console.error("App.js: Failed to parse 'favorites' from localStorage, defaulting to []. Error:", e);
      }
    }
    return []; 
  });

  const [allTracks, setAllTracks] = useState([]);
  const [isLoadingGlobalTracks, setIsLoadingGlobalTracks] = useState(true);

  useEffect(() => {
    const loadAllTracks = async () => {
      setIsLoadingGlobalTracks(true); 
      try {
        const tracksData = await fetchAllTracksFromApi(); 
        setAllTracks(Array.isArray(tracksData) ? tracksData : []);
      } catch (error) {
        console.error("Failed to load all tracks in App.js:", error);
        setAllTracks([]); 
      } finally {
        setIsLoadingGlobalTracks(false); 
      }
    };
    loadAllTracks();
  }, []);

  useEffect(() => {
    if (Array.isArray(favorites)) { 
      localStorage.setItem('playpod_favorites', JSON.stringify(favorites));
    } else {
      console.error("App.js: CRITICAL - 'favorites' state became NON-ARRAY during an update! Value:", favorites, "Forcing to empty array.");
      setFavorites([]); 
    }
  }, [favorites]);

  const toggleFavorite = useCallback((trackId) => {
    if (!trackId) return; 
    setFavorites(prevFavorites => {
      const currentFavorites = Array.isArray(prevFavorites) ? prevFavorites : [];
      if (currentFavorites.includes(trackId)) {
        return currentFavorites.filter(id => id !== trackId);
      } else {
        return [...currentFavorites, trackId];
      }
    });
  }, []);
  
  const normalizeTrackForPlayback = (trackInput, albumContext = {}) => {
    if (!trackInput || typeof trackInput.id === 'undefined') {
        return null; 
    }
    const title = trackInput.title || "Без названия";
    const artist = trackInput.artist || albumContext.artist || "Неизвестный исполнитель";
    const albumTitle = trackInput.album_title || albumContext.title || "Неизвестный альбом";
    const coverUrl = trackInput.album_cover_url || trackInput.cover_url || albumContext.cover_url || '/covers/default_cover.png';
    const audioUrl = trackInput.audio_url || '#';
    const durationMs = typeof trackInput.duration_ms === 'number' ? trackInput.duration_ms : 200000;

    return {
      id: trackInput.id,
      title: title,
      artist: artist,
      album_title: albumTitle,
      cover_url: coverUrl,
      audio_url: audioUrl,
      duration_ms: durationMs,
      ...trackInput 
    };
  };

  const playTrack = useCallback((trackToPlay, playlistContext = null) => {
    const albumInfoForContext = playlistContext && playlistContext.length > 0 
        ? playlistContext[0] 
        : trackToPlay;     

    const normalizedTrack = normalizeTrackForPlayback(trackToPlay, albumInfoForContext);
    
    if (!normalizedTrack || !normalizedTrack.audio_url || normalizedTrack.audio_url === '#') {
      console.warn("Cannot play track: No valid audio URL or track data.", normalizedTrack);
      setIsPlaying(false);
      return;
    }

    let newPlaylist;
    if (playlistContext && Array.isArray(playlistContext) && playlistContext.length > 0) {
      newPlaylist = playlistContext.map(t => normalizeTrackForPlayback(t, albumInfoForContext)).filter(t => t); 
    } else {
      newPlaylist = [normalizedTrack]; 
    }
    
    const newTrackIndex = newPlaylist.findIndex(t => t.id === normalizedTrack.id);

    setPlaylist(newPlaylist);
    setCurrentTrackIndex(newTrackIndex !== -1 ? newTrackIndex : 0);
    setCurrentTrack(normalizedTrack);
    setIsPlaying(true);

  }, []); 

  const handleTogglePlayPause = useCallback((shouldPlay) => {
      if (currentTrack && currentTrack.audio_url && currentTrack.audio_url !== '#') {
        setIsPlaying(prevIsPlaying => typeof shouldPlay === 'boolean' ? shouldPlay : !prevIsPlaying);
      } else {
        setIsPlaying(false); 
      }
  }, [currentTrack]);

   const playNextTrack = useCallback(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    const nextTrackToPlay = playlist[nextIndex]; 
    
    if (nextTrackToPlay && nextTrackToPlay.audio_url && nextTrackToPlay.audio_url !== '#') {
        setCurrentTrackIndex(nextIndex);
        setCurrentTrack(nextTrackToPlay);
        setIsPlaying(true);
    } else {
        console.warn("Next track is unplayable.", nextTrackToPlay);
        setIsPlaying(false); 
    }
  }, [playlist, currentTrackIndex]);

  const playPrevTrack = useCallback(() => {
    if (!Array.isArray(playlist) || playlist.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    const prevTrackToPlay = playlist[prevIndex]; 

    if (prevTrackToPlay && prevTrackToPlay.audio_url && prevTrackToPlay.audio_url !== '#') {
        setCurrentTrackIndex(prevIndex);
        setCurrentTrack(prevTrackToPlay);
        setIsPlaying(true);
    } else {
        console.warn("Previous track is unplayable.", prevTrackToPlay);
        setIsPlaying(false);
    }
  }, [playlist, currentTrackIndex]);

  // Убираем <Router> отсюда, так как он теперь в index.js
  return ( 
      <div className="app-container">
        <div className="app-main-content-area">
          <Sidebar />
          <MainView>
            <Routes>
              <Route path="/" element={<HomePage onPlayTrack={playTrack} />} />
              <Route 
                path="/album/:albumId" 
                element={
                  <AlbumPage 
                    onPlayTrack={playTrack} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite} 
                    currentTrack={currentTrack} 
                    isPlaying={isPlaying}       
                  />
                } 
              />
              <Route 
                path="/genre/:genreName" 
                element={
                  <GenrePage 
                    onPlayTrack={playTrack} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    currentTrack={currentTrack} 
                    isPlaying={isPlaying}       
                  />
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <FavoritesPage 
                    allTracks={allTracks} 
                    isLoadingTracks={isLoadingGlobalTracks} 
                    favorites={favorites} 
                    onToggleFavorite={toggleFavorite} 
                    onPlayTrack={playTrack} 
                    currentTrack={currentTrack} 
                    isPlaying={isPlaying}       
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
