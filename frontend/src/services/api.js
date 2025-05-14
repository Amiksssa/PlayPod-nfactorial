// frontend/src/services/api.js

const API_BASE_URL = 'http://localhost:5000/api'; // Убедись, что порт совпадает с твоим Flask-сервером

export const fetchAlbums = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/albums`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not fetch albums:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

export const fetchAlbumById = async (albumId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/albums/${albumId}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Album with ID ${albumId} not found.`);
        return null; // Альбом не найден
      }
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch album ${albumId}:`, error);
    throw error; // Перебрасываем ошибку для обработки в компоненте
  }
};

export const fetchGenres = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/genres`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not fetch genres:", error);
    return [];
  }
};

export const fetchTracksByGenre = async (genreName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks?genre=${encodeURIComponent(genreName)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch tracks for genre ${genreName}:`, error);
    return [];
  }
};

export const fetchAllTracksFromApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const tracks = await response.json();
    // Нормализация данных, чтобы убедиться в наличии всех полей
    return tracks.map(track => ({
      id: track.id,
      title: track.title || "Без названия",
      artist: track.artist || "Неизвестный исполнитель",
      album_id: track.album_id,
      album_title: track.album_title || "Неизвестный альбом",
      album_cover_url: track.album_cover_url || track.cover_url || '/covers/default_cover.png',
      audio_url: track.audio_url || '#', // Если URL нет, ставим заглушку
      duration_ms: typeof track.duration_ms === 'number' ? track.duration_ms : 200000, // Длительность по умолчанию
      genre: track.genre,
      track_number: track.track_number,
      features: track.features,
    }));
  } catch (error) {
    console.error("Could not fetch all tracks:", error);
    return [];
  }
};
