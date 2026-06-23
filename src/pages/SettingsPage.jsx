import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Camera, Save, Loader2, 
  Bell, Shield, Moon, Sun, Globe, LogOut, 
  ChevronRight, Edit2, X, Check
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import userApi from '../api/user.api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'notifications' | 'appearance' | 'security'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    announcementAlerts: true,
    serviceReminders: true,
    noiseAlerts: true,
  });
  
  const [appearance, setAppearance] = useState({
    theme: 'light', // 'light' | 'dark' | 'system'
    fontSize: 'medium', // 'small' | 'medium' | 'large'
    compactMode: false,
  });

  // Charger les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      if (user.photoUrl) {
        setAvatarPreview(user.photoUrl);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 2MB');
        return;
      }
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // 1. Mettre à jour le profil
      const profileResponse = await userApi.updateProfile({
        name: formData.name,
        email: formData.email,
      });
      
      if (!profileResponse.data.success) {
        throw new Error(profileResponse.data.message || 'Erreur lors de la mise à jour du profil');
      }
      
      // 2. Uploader l'avatar si présent
      if (avatarFile) {
        await userApi.uploadAvatar(avatarFile);
      } else if (avatarPreview === null && user?.photoUrl) {
        // Si l'utilisateur a supprimé son avatar
        // Note: Implémenter la suppression d'avatar si nécessaire
      }
      
      toast.success('Profil mis à jour avec succès');
      
      // Mettre à jour l'utilisateur dans le localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        photoUrl: avatarPreview || user?.photoUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Recharger la page pour refléter les changements
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      await logout();
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">⚙️ Paramètres</h1>
      </div>

      <div className="settings-layout">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-profile-summary">
            <div className="settings-avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt={formData.name || 'Avatar'} />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <div className="settings-user-info">
              <h3 className="settings-user-name">{formData.name || 'Utilisateur'}</h3>
              <p className="settings-user-role">{user?.role || 'Membre'}</p>
            </div>
          </div>

          <nav className="settings-nav">
            <button
              className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="icon" />
              <span>Profil</span>
              <ChevronRight className="icon-arrow" />
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="icon" />
              <span>Notifications</span>
              <ChevronRight className="icon-arrow" />
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Sun className="icon" />
              <span>Apparence</span>
              <ChevronRight className="icon-arrow" />
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="icon" />
              <span>Sécurité</span>
              <ChevronRight className="icon-arrow" />
            </button>
          </nav>

          <div className="settings-sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut className="icon" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>👤 Profil</h2>
              <p className="section-description">
                Gérez vos informations personnelles
              </p>

              <form onSubmit={handleSubmit} className="settings-form">
                {/* Avatar */}
                <div className="form-group avatar-group">
                  <label className="form-label">Photo de profil</label>
                  <div className="avatar-upload">
                    <div className="avatar-preview">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" />
                      ) : (
                        <div className="avatar-placeholder-large">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div className="avatar-actions">
                      <label className="upload-btn">
                        <Camera className="icon" />
                        <span>Changer</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {avatarPreview && (
                        <button type="button" className="remove-btn" onClick={handleRemoveAvatar}>
                          <X className="icon" /> Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="form-help">Formats acceptés: JPG, PNG, WEBP (max 2MB)</p>
                </div>

                {/* Nom */}
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      className="form-input"
                      disabled
                    />
                  </div>
                  <p className="form-help">Le numéro de téléphone ne peut pas être modifié</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={isSaving}>
                    {isSaving ? (
                      <><Loader2 className="icon spin" /> Enregistrement...</>
                    ) : (
                      <><Save className="icon" /> Enregistrer les modifications</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>🔔 Notifications</h2>
              <p className="section-description">
                Gérez vos préférences de notification
              </p>

              <div className="notifications-list">
                <div className="notification-item">
                  <div className="notification-info">
                    <Bell className="icon" />
                    <div>
                      <h4>Notifications par email</h4>
                      <p>Recevoir des notifications par email</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.emailNotifications ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('emailNotifications')}
                  >
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </button>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <Bell className="icon" />
                    <div>
                      <h4>Notifications push</h4>
                      <p>Recevoir des notifications sur votre appareil</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.pushNotifications ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('pushNotifications')}
                  >
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </button>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <Bell className="icon" />
                    <div>
                      <h4>Alertes d'annonces</h4>
                      <p>Être informé des nouvelles annonces</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.announcementAlerts ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('announcementAlerts')}
                  >
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </button>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <Bell className="icon" />
                    <div>
                      <h4>Rappels de services</h4>
                      <p>Recevoir des rappels avant les services</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.serviceReminders ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('serviceReminders')}
                  >
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </button>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <Bell className="icon" />
                    <div>
                      <h4>Alertes de bruit</h4>
                      <p>Être informé des niveaux de bruit élevés</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.noiseAlerts ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('noiseAlerts')}
                  >
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={() => {
                  toast.success('Préférences de notification enregistrées');
                }}>
                  <Save className="icon" /> Enregistrer les préférences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>🎨 Apparence</h2>
              <p className="section-description">
                Personnalisez l'apparence de l'application
              </p>

              <div className="appearance-settings">
                <div className="appearance-group">
                  <label className="form-label">Thème</label>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${appearance.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleAppearanceChange('theme', 'light')}
                    >
                      <Sun className="icon" />
                      <span>Clair</span>
                    </button>
                    <button
                      className={`theme-option ${appearance.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleAppearanceChange('theme', 'dark')}
                    >
                      <Moon className="icon" />
                      <span>Sombre</span>
                    </button>
                    <button
                      className={`theme-option ${appearance.theme === 'system' ? 'active' : ''}`}
                      onClick={() => handleAppearanceChange('theme', 'system')}
                    >
                      <Globe className="icon" />
                      <span>Système</span>
                    </button>
                  </div>
                </div>

                <div className="appearance-group">
                  <label className="form-label">Taille du texte</label>
                  <div className="font-size-options">
                    <button
                      className={`font-option ${appearance.fontSize === 'small' ? 'active' : ''}`}
                      onClick={() => handleAppearanceChange('fontSize', 'small')}
                    >
                      <span className="text-small">A</span>
                      <span>Petit</span>
                    </button>
                    <button
                      className={`font-option ${appearance.fontSize === 'medium' ? 'active' : ''}`}
                      onClick={() => handleAppearanceChange('fontSize', 'medium')}
                    >
                      <span className="text-medium">A</span>
                      <span>Moyen</span>
                    </button>
                    <button
                      className={`font-option ${appearance.fontSize === 'large' ? 'active' : ''}`}
                      onClick={() => handleAppearanceChange('fontSize', 'large')}
                    >
                      <span className="text-large">A</span>
                      <span>Grand</span>
                    </button>
                  </div>
                </div>

                <div className="appearance-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={appearance.compactMode}
                      onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)}
                    />
                    <span>Mode compact</span>
                  </label>
                  <p className="form-help">Réduit les espaces pour afficher plus de contenu</p>
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={() => {
                  toast.success('Préférences d\'apparence enregistrées');
                }}>
                  <Save className="icon" /> Enregistrer les préférences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>🔒 Sécurité</h2>
              <p className="section-description">
                Gérez la sécurité de votre compte
              </p>

              <div className="security-settings">
                <div className="security-item">
                  <div className="security-info">
                    <Shield className="icon" />
                    <div>
                      <h4>Changer de mot de passe</h4>
                      <p>Mettez à jour votre mot de passe régulièrement</p>
                    </div>
                  </div>
                  <button className="security-btn">
                    Changer <ChevronRight className="icon" />
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <Shield className="icon" />
                    <div>
                      <h4>Authentification à deux facteurs</h4>
                      <p>Ajoutez une couche de sécurité supplémentaire</p>
                    </div>
                  </div>
                  <button className="security-btn">
                    Activer <ChevronRight className="icon" />
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <Shield className="icon" />
                    <div>
                      <h4>Sessions actives</h4>
                      <p>Gérez vos sessions de connexion</p>
                    </div>
                  </div>
                  <button className="security-btn">
                    Voir <ChevronRight className="icon" />
                  </button>
                </div>

                <div className="security-item danger">
                  <div className="security-info">
                    <LogOut className="icon" />
                    <div>
                      <h4>Déconnexion de tous les appareils</h4>
                      <p>Déconnectez-vous de tous les appareils actifs</p>
                    </div>
                  </div>
                  <button className="security-btn danger" onClick={handleLogout}>
                    Déconnecter tout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;