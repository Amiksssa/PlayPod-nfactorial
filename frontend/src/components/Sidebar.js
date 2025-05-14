import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Library, Search, PlusSquare, Heart, Radio } from 'lucide-react';

const Sidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : ""}`;

  return (
    <aside className="sidebar-container">
      <Link to="/" className="sidebar-logo-link">
        <Radio size={28} className="sidebar-logo-icon"/>
        <span className="sidebar-logo-text">PlayPod</span>
      </Link>
      <nav className="sidebar-nav">
        <NavLink to="/" className={navLinkClass} end>
          <Home size={24} className="sidebar-nav-icon"/>
          <span>Главная</span>
        </NavLink>
        <NavLink to="/search" className={navLinkClass}>
          <Search size={24} className="sidebar-nav-icon"/>
          <span>Поиск</span>
        </NavLink>
        <NavLink to="/library" className={navLinkClass}>
          <Library size={24} className="sidebar-nav-icon"/>
          <span>Моя медиатека</span>
        </NavLink>
      </nav>
      <div className="sidebar-actions">
        <button className="sidebar-action-item">
          <PlusSquare size={24} className="sidebar-nav-icon"/>
          <span>Создать плейлист</span>
        </button>
        <NavLink to="/favorites" className={navLinkClass}>
          <Heart size={24} className="sidebar-nav-icon"/>
          <span>Любимые треки</span>
        </NavLink>
      </div>
      <hr className="sidebar-divider" />
      <div className="sidebar-playlists">
        <p className="sidebar-playlist-item">Плейлист 1</p>
        <p className="sidebar-playlist-item">Мои рок-хиты</p>
        <p className="sidebar-playlist-item">Для тренировок</p>
      </div>
    </aside>
  );
};
export default Sidebar; // Экспорт по умолчанию
