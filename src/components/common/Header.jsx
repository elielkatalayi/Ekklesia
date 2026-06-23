import React from 'react';
import  useAuth  from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <h1 className="header-title">Tableau de bord</h1>
      
      <div className="header-actions">
        <div className="header-user">
          <div className="header-avatar">👤</div>
          <span className="header-username">{user?.name || 'Utilisateur'}</span>
        </div>
        
        <button onClick={handleLogout} className="header-logout" title="Déconnexion">
          🚪
        </button>
      </div>
    </header>
  );
};

export default Header;