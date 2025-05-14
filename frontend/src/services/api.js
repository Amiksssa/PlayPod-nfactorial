import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

export const fetchAlbums = async (genre) => {
  try {
    const params = genre ? { genre } : {};
    const response = await axios.get(`${API_BASE_URL}/albums`, { params });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching albums:", error);
    return [];
  }
};

export const fetchAlbumById = async (albumId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/${albumId}`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching album ${albumId}:`, error);
    return null;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genres`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const fetchTracks = async ({ albumId, genre } = {}) => {
    try {
      const params = {};
      if (albumId) params.album_id = albumId;
      if (genre) params.genre = genre;
      const response = await axios.get(`${API_BASE_URL}/tracks`, { params });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching tracks:", error);
      return [];
    }
  };
