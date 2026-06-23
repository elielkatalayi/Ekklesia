import React, { useState, useEffect } from 'react';
import { 
  Users, Music, Calendar, Megaphone, 
  Activity, Bell, Clock, TrendingUp,
  Loader2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import churchApi from '../api/church.api';
import  bibleApi   from '../api/bible.api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    hymns: 0,
    services: 0,
    announcements: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [verseOfTheDay, setVerseOfTheDay] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData();
    
    // Mettre à jour l'heure toutes les minutes
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Charger les statistiques
      if (user?.churchId) {
        const statsResponse = await churchApi.getStats(user.churchId);
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data.stats);
        }
      }

      // Charger le verset du jour
      try {
        const verseResponse = await bibleApi ();
        if (verseResponse.data.success) {
          setVerseOfTheDay(verseResponse.data.data.verse);
        }
      } catch (error) {
        console.log('Verset du jour non disponible');
      }

      // Charger les activités récentes (simulées pour l'instant)
      setRecentActivities([
        {
          id: 1,
          type: 'member',
          action: 'Nouveau membre inscrit',
          user: 'Jean Dupont',
          time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes
        },
        {
          id: 2,
          type: 'announcement',
          action: 'Nouvelle annonce publiée',
          user: 'Pasteur Jean',
          time: new Date(Date.now() - 1000 * 60 * 120), // 2 heures
        },
        {
          id: 3,
          type: 'service',
          action: 'Service du dimanche planifié',
          user: 'Modérateur',
          time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 heures
        },
      ]);

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    toast.success('Données actualisées');
  };

  // Formater la date relative
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  // Obtenir l'icône pour une activité
  const getActivityIcon = (type) => {
    switch(type) {
      case 'member': return <Users className="icon" />;
      case 'announcement': return <Megaphone className="icon" />;
      case 'service': return <Calendar className="icon" />;
      default: return <Activity className="icon" />;
    }
  };

  // Statistiques par défaut si pas de données
  const displayStats = stats || { members: 0, hymns: 0, services: 0, announcements: 0 };

  return (
    <div className="dashboard-page">
      {/* En-tête avec bienvenue et heure */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            📊 Tableau de bord
          </h1>
          <p className="dashboard-subtitle">
            Bienvenue {user?.name || 'Utilisateur'} ! 👋
            {user?.role && (
              <span className="user-role-badge">
                {user.role === 'pastor' && '👑 Pasteur'}
                {user.role === 'moderator' && '⚙️ Modérateur'}
                {user.role === 'deacon' && '🙏 Diacre'}
                {user.role === 'member' && '👤 Membre'}
              </span>
            )}
          </p>
        </div>
        <div className="dashboard-header-actions">
          <div className="dashboard-time">
            <Clock className="icon" />
            <span>{currentTime.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}</span>
          </div>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`icon ${isLoading ? 'spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <Users className="icon" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{displayStats.members || 0}</span>
            <span className="stat-label">Membres</span>
            {displayStats.members > 0 && (
              <span className="stat-change positive">
                <TrendingUp className="icon" /> +12%
              </span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Music className="icon" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{displayStats.hymns || 0}</span>
            <span className="stat-label">Cantiques</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <Calendar className="icon" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{displayStats.services || 0}</span>
            <span className="stat-label">Services</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce4ec', color: '#dc2626' }}>
            <Megaphone className="icon" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{displayStats.announcements || 0}</span>
            <span className="stat-label">Annonces</span>
          </div>
        </div>
      </div>

      {/* Verset du jour */}
      {verseOfTheDay && (
        <div className="verse-of-the-day-card">
          <div className="verse-header">
            <span className="verse-icon">📖</span>
            <span className="verse-label">Verset du jour</span>
          </div>
          <p className="verse-text">"{verseOfTheDay.text}"</p>
          <p className="verse-reference">
            — {verseOfTheDay.bookName} {verseOfTheDay.chapter}:{verseOfTheDay.verse}
          </p>
        </div>
      )}

      {/* Activités récentes */}
      <div className="recent-activities">
        <h2 className="section-title">
          🕐 Activités récentes
        </h2>
        {recentActivities.length === 0 ? (
          <div className="activities-empty">
            <Activity className="icon" />
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-user">{activity.user}</p>
                </div>
                <span className="activity-time">
                  {formatRelativeTime(activity.time)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-card">
          <div className="notifications-header">
            <Bell className="icon" />
            <span>Notifications</span>
          </div>
          <div className="notifications-list">
            {notifications.map((notif, index) => (
              <div key={index} className="notification-item">
                <span className="notification-dot"></span>
                <span className="notification-text">{notif.message}</span>
                <span className="notification-time">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État de chargement */}
      {isLoading && (
        <div className="loading-overlay">
          <Loader2 className="icon spin" />
          <p>Chargement des données...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;