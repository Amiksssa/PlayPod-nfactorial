import { useNavigate } from 'react-router-dom';
import { Music, Disc3, Mic2, Radio as RadioIconHomePage } from 'lucide-react'; 

const MAIN_GENRES_HomePage = [
  { name: 'Хип-хоп', icon: <Disc3 size={36} className="genre-button-icon" />, cssClass: 'genre-button-hiphop' },
  { name: 'Поп', icon: <Mic2 size={36} className="genre-button-icon" />, cssClass: 'genre-button-pop' },
  { name: 'Рок', icon: <Music size={36} className="genre-button-icon" />, cssClass: 'genre-button-rock' },
  { name: 'R&B', icon: <RadioIconHomePage size={36} className="genre-button-icon" />, cssClass: 'genre-button-rnb' },
];
const HomePage = () => {
  const navigate = useNavigate();
  const handleGenreClick_HomePage = (genreName) => navigate(`/genre/${encodeURIComponent(genreName)}`);
  return (
    <div className="home-page-container">
      <div className="home-page-content-wrapper">
        <Music size={60} className="home-page-main-icon" />
        <h1 className="home-page-title">Добро пожаловать в PlayPod!</h1>
        <p className="home-page-subtitle">Выберите ваш любимый жанр и погрузитесь в мир музыки.</p>
        <div className="genre-grid">
          {MAIN_GENRES_HomePage.map((genre) => (
            <button key={genre.name} onClick={() => handleGenreClick_HomePage(genre.name)} className={`genre-button ${genre.cssClass}`}>
              {genre.icon} <span className="genre-button-text">{genre.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomePage; 

