// PlayPod/frontend/src/components/Sidebar.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// Убедитесь, что иконки импортированы
import { Home, Library, Search, PlusSquare, Heart, Radio } from 'lucide-react';

const Sidebar = () => {
  // Функция для определения активного класса NavLink больше не нужна в таком виде,
  // так как стили будут в CSS. Но мы можем оставить ее для добавления класса 'active'
  const navLinkIsActive = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <div className="sidebar-container"> {/* Главный контейнер сайдбара */}
      <Link to="/" className="sidebar-logo-link">
        <Radio size={28} className="sidebar-logo-icon"/>
        <span className="sidebar-logo-text">PlayPod</span>
      </Link>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => "sidebar-nav-item " + (isActive ? "sidebar-nav-item-active" : "")} end>
          <Home size={24} className="sidebar-nav-icon"/>
          <span>Главная</span>
        </NavLink>
        <NavLink to="/search" className={({isActive}) => "sidebar-nav-item " + (isActive ? "sidebar-nav-item-active" : "")}>
          <Search size={24} className="sidebar-nav-icon"/>
          <span>Поиск</span>
        </NavLink>
        <NavLink to="/library" className={({isActive}) => "sidebar-nav-item " + (isActive ? "sidebar-nav-item-active" : "")}>
          <Library size={24} className="sidebar-nav-icon"/>
          <span>Моя медиатека</span>
        </NavLink>
      </nav>

      <div className="sidebar-actions">
        <button className="sidebar-action-item">
          <PlusSquare size={24} className="sidebar-nav-icon"/>
          <span>Создать плейлист</span>
        </button>
        <NavLink to="/favorites" className={({isActive}) => "sidebar-action-item " + (isActive ? "sidebar-nav-item-active" : "")}>
          <Heart size={24} className="sidebar-nav-icon"/>
          <span>Любимые треки</span>
        </NavLink>
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-playlists">
        {/* Пример плейлистов */}
        <p className="sidebar-playlist-item">Плейлист 1</p>
        <p className="sidebar-playlist-item">Мои рок-хиты</p>
        <p className="sidebar-playlist-item">Для тренировок</p>
      </div>
    </div>
  );
};

export default Sidebar;
