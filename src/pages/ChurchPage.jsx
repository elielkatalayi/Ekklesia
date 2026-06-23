import React, { useState, useEffect } from 'react';
import { Building2, Users, Music, Calendar, Megaphone, Edit2, Camera, Image } from 'lucide-react';
import ChurchSettings from '../components/church/ChurchSettings';
import MembersList from '../components/church/MembersList';
import MemberManagement from '../components/church/MemberManagement';
import churchApi from '../api/church.api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ChurchPage = () => {
  const { user } = useAuth();
  const [church, setChurch] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'settings' | 'members'
  const [showMemberManagement, setShowMemberManagement] = useState(false);

  const isPastor = user?.role === 'pastor';
  const isModerator = ['pastor', 'moderator'].includes(user?.role);

  useEffect(() => {
    if (user?.churchId) {
      loadChurchData();
    }
  }, [user]);

  const loadChurchData = async () => {
    setIsLoading(true);
    try {
      const [churchRes, statsRes] = await Promise.all([
        churchApi.getChurch(user.churchId),
        churchApi.getStats(user.churchId),
      ]);

      if (churchRes.data.success) {
        setChurch(churchRes.data.data.church);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data.stats);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChurchUpdate = (updatedChurch) => {
    setChurch(updatedChurch);
    toast.success('Église mise à jour');
  };

  if (isLoading) {
    return (
      <div className="church-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="church-empty">
        <Building2 className="icon large" />
        <h3>Aucune église trouvée</h3>
        <p>Vous n'êtes pas encore associé à une église</p>
      </div>
    );
  }

  return (
    <div className="church-page">
      {/* En-tête avec bannière */}
      <div className="church-header">
        {church.bannerUrl ? (
          <div className="church-banner">
            <img src={church.bannerUrl} alt={church.name} />
            {isPastor && (
              <button className="upload-banner-btn" onClick={() => document.getElementById('banner-upload').click()}>
                <Camera className="icon" /> Changer la bannière
              </button>
            )}
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    await churchApi.uploadBanner(church.id, file);
                    loadChurchData();
                    toast.success('Bannière mise à jour');
                  } catch (error) {
                    toast.error('Erreur lors de l\'upload');
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="church-banner-placeholder">
            <Building2 className="icon" />
            {isPastor && (
              <button className="upload-banner-btn" onClick={() => document.getElementById('banner-upload').click()}>
                <Camera className="icon" /> Ajouter une bannière
              </button>
            )}
          </div>
        )}
      </div>

      {/* Profil de l'église */}
      <div className="church-profile">
        <div className="church-logo-container">
          {church.logoUrl ? (
            <img src={church.logoUrl} alt={church.name} className="church-logo" />
          ) : (
            <div className="church-logo-placeholder">
              <Building2 className="icon" />
            </div>
          )}
          {isPastor && (
            <button className="upload-logo-btn" onClick={() => document.getElementById('logo-upload').click()}>
              <Camera className="icon" />
            </button>
          )}
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  await churchApi.uploadLogo(church.id, file);
                  loadChurchData();
                  toast.success('Logo mis à jour');
                } catch (error) {
                  toast.error('Erreur lors de l\'upload');
                }
              }
            }}
          />
        </div>

        <div className="church-info">
          <h1 className="church-name">{church.name}</h1>
          {church.pastorName && (
            <p className="church-pastor">Pasteur: {church.pastorName}</p>
          )}
          {church.address && (
            <p className="church-address">{church.address}</p>
          )}
          {church.phone && (
            <p className="church-phone">📞 {church.phone}</p>
          )}
        </div>

        <div className="church-actions">
          {isModerator && (
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Edit2 className="icon" /> Paramètres
            </button>
          )}
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Tableau de bord
          </button>
          <button
            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Membres
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="church-content">
        {activeTab === 'dashboard' && (
          <div className="church-dashboard">
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <Users className="icon" />
                <div className="stat-info">
                  <span className="stat-value">{stats?.members || 0}</span>
                  <span className="stat-label">Membres</span>
                </div>
              </div>
              <div className="stat-card">
                <Music className="icon" />
                <div className="stat-info">
                  <span className="stat-value">{stats?.hymns || 0}</span>
                  <span className="stat-label">Cantiques</span>
                </div>
              </div>
              <div className="stat-card">
                <Calendar className="icon" />
                <div className="stat-info">
                  <span className="stat-value">{stats?.services || 0}</span>
                  <span className="stat-label">Services</span>
                </div>
              </div>
              <div className="stat-card">
                <Megaphone className="icon" />
                <div className="stat-info">
                  <span className="stat-value">{stats?.announcements || 0}</span>
                  <span className="stat-label">Annonces</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {church.description && (
              <div className="church-description">
                <h3>À propos</h3>
                <p>{church.description}</p>
              </div>
            )}

            {/* Contact */}
            <div className="church-contact">
              <h3>Contact</h3>
              {church.contactEmail && (
                <p>📧 {church.contactEmail}</p>
              )}
              {church.phone && (
                <p>📞 {church.phone}</p>
              )}
              {church.address && (
                <p>📍 {church.address}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && isModerator && (
          <ChurchSettings
            church={church}
            onUpdate={handleChurchUpdate}
          />
        )}

        {activeTab === 'members' && (
          <MembersList
            churchId={church.id}
            canManage={isModerator}
            onManageMember={() => setShowMemberManagement(true)}
          />
        )}
      </div>

      {/* Member Management Modal */}
      {showMemberManagement && isModerator && (
        <div className="member-modal">
          <div className="modal-overlay" onClick={() => setShowMemberManagement(false)}></div>
          <div className="modal-content">
            <MemberManagement
              churchId={church.id}
              onClose={() => setShowMemberManagement(false)}
              onUpdate={() => {
                loadChurchData();
                // Recharger la liste des membres
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchPage;