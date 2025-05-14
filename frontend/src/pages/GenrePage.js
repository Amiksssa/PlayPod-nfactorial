// PlayPod/frontend/src/pages/GenrePage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlbums } from '../services/api';
import AlbumCard from '../components/AlbumCard'; // Убедитесь, что AlbumCard импортирован
import { ChevronLeft, Music } from 'lucide-react';

const GenrePage = () => {
  const { genreName } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodedGenreName = decodeURIComponent(genreName || '');

  useEffect(() => {
    if (!decodedGenreName) {
      setLoading(false);
      setError("Жанр не указан.");
      return;
    }

    const loadAlbumsByGenre = async () => {
      setLoading(true);
      setError(null);
      try {
        const albumsData = await fetchAlbums(decodedGenreName);
        setAlbums(albumsData || []);
      } catch (err) {
        console.error(`Error loading albums for genre ${decodedGenreName}:`, err);
        setError('Не удалось загрузить альбомы для этого жанра.');
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlbumsByGenre();
  }, [decodedGenreName]);

  if (loading) {
    return <div className="loading-message">Загрузка альбомов жанра "{decodedGenreName}"... <Music size={28} className="loading-icon"/></div>;
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

  return (
    <div className="genre-page-container">
      <Link to="/" className="genre-page-back-link">
        <ChevronLeft size={24} />
        Назад к выбору жанра
      </Link>
      <h1 className="genre-page-title">
        Альбомы в жанре: <span className="genre-page-title-highlight">{decodedGenreName}</span>
      </h1>
      {albums.length > 0 ? (
        // Используем новый класс для сетки альбомов
        <div className="albums-grid-horizontal">
          {albums.map(album => (
            // AlbumCard теперь будет получать весь объект album, из которого он возьмет title, artist, genre
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <p className="genre-page-no-albums">
          В жанре "{decodedGenreName}" альбомы не найдены. Попробуйте другой жанр.
        </p>
      )}
    </div>
  );
};

export default GenrePage;
