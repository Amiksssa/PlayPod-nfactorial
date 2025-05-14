import { Play as PlayIconAlbumCard } from 'lucide-react'; 

const AlbumCard = ({ album }) => {
  if (!album) return null;
  const coverUrl = album.cover_url || `https://placehold.co/200x200/181818/b3b3b3?text=${encodeURIComponent(album.title || 'Album')}`;
  return (
    <Link to={`/album/${album.id}`} className="album-card-link">
      <div className="album-card-image-wrapper">
        <img src={coverUrl} alt={album.title || 'Album cover'} className="album-card-image" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/282828/ffffff?text=Error`; }}/>
        <button className="album-card-play-button" onClick={(e) => { e.preventDefault(); console.log(`Play album: ${album.title}`);}} aria-label={`Play ${album.title}`}>
          <PlayIconAlbumCard size={24} fill="currentColor" />
        </button>
      </div>
      <div className="album-card-info">
        <h3 className="album-card-title" title={album.title}>{album.title || 'Без названия'}</h3>
        <p className="album-card-details"><span className="detail-label">Автор:</span> {album.artist || 'Неизвестен'}</p>
        <p className="album-card-details"><span className="detail-label">Жанр:</span> {album.genre || 'Неизвестен'}</p>
      </div>
    </Link>
  );
};
export default AlbumCard;
