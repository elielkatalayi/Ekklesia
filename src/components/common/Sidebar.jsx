import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Tableau de bord' },
    { path: '/bible', icon: '📖', label: 'Bible' },
    { path: '/hymns', icon: '🎵', label: 'Cantiques' },
    { path: '/services', icon: '⛪', label: 'Services' },
    { path: '/announcements', icon: '📢', label: 'Annonces' },
    { path: '/church', icon: '🏛️', label: 'Église' },
    { path: '/noise', icon: '🔊', label: 'Bruit' },
    { path: '/settings', icon: '⚙️', label: 'Paramètres' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>⛪ Église App</h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;