import React, { useState, useEffect } from 'react';
import { Volume2, Activity, AlertTriangle, Settings, RefreshCw, Download } from 'lucide-react';
import NoiseMonitor from '../components/noise/NoiseMonitor';
import NoiseChart from '../components/noise/NoiseChart';
import NoiseAlerts from '../components/noise/NoiseAlerts';
import NoiseSettings from '../components/noise/NoiseSettings';
import noiseApi from '../api/noise.api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const NoisePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'history' | 'alerts' | 'settings'
  const [currentNoise, setCurrentNoise] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [settings, setSettings] = useState(null);

  const canManage = ['pastor', 'moderator'].includes(user?.role);

  useEffect(() => {
    loadCurrentNoise();
    if (activeTab === 'monitor') {
      const interval = setInterval(loadCurrentNoise, 10000); // Rafraîchir toutes les 10s
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') loadHistory();
    if (activeTab === 'alerts') loadAlerts();
    if (activeTab === 'settings') loadSettings();
  }, [activeTab]);

  const loadCurrentNoise = async () => {
    try {
      const response = await noiseApi.getCurrentNoise();
      if (response.data.success) {
        setCurrentNoise(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement bruit:', error);
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await noiseApi.getHistory({ hours: 24 });
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await noiseApi.getAlerts();
      if (response.data.success) {
        setAlerts(response.data.data.alerts || []);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des alertes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await noiseApi.getSettings();
      if (response.data.success) {
        setSettings(response.data.data.settings);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadCurrentNoise();
    if (activeTab === 'history') loadHistory();
    if (activeTab === 'alerts') loadAlerts();
    toast.success('Actualisé');
  };

  const handleSettingsUpdate = (updatedSettings) => {
    setSettings(updatedSettings);
    toast.success('Paramètres mis à jour');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'silence': return '#94a3b8';
      case 'normal': return '#22c55e';
      case 'elevated': return '#eab308';
      case 'very_high': return '#f97316';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'silence': return '🔇 Silence';
      case 'normal': return '🔉 Normal';
      case 'elevated': return '🔊 Élevé';
      case 'very_high': return '📢 Très élevé';
      case 'danger': return '🚨 Dangereux';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="noise-page">
      <div className="page-header">
        <h1 className="page-title">🔊 Moniteur de bruit</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw className="icon" /> Actualiser
          </button>
          {canManage && (
            <button 
              className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="icon" /> Paramètres
            </button>
          )}
        </div>
      </div>

      {/* Niveau actuel */}
      {currentNoise && currentNoise.hasData && (
        <div className="noise-current">
          <div className="noise-level">
            <div className="noise-value" style={{ color: getStatusColor(currentNoise.status) }}>
              {currentNoise.currentDb} dB
            </div>
            <div className="noise-status">
              {getStatusLabel(currentNoise.status)}
            </div>
            <div className="noise-time">
              Dernière mise à jour: {new Date(currentNoise.lastUpdate).toLocaleTimeString()}
            </div>
          </div>
          <div className="noise-meter">
            <div 
              className="noise-meter-fill" 
              style={{ 
                width: `${Math.min((currentNoise.currentDb / 120) * 100, 100)}%`,
                backgroundColor: getStatusColor(currentNoise.status)
              }}
            />
          </div>
          <div className="noise-scale">
            <span>0 dB</span>
            <span>30 dB</span>
            <span>60 dB</span>
            <span>90 dB</span>
            <span>120 dB</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="noise-tabs">
        <button
          className={`tab-btn ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
        >
          <Activity className="icon" /> Moniteur
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Volume2 className="icon" /> Historique
        </button>
        <button
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle className="icon" /> Alertes
          {alerts.filter(a => a.status === 'active').length > 0 && (
            <span className="alert-badge">
              {alerts.filter(a => a.status === 'active').length}
            </span>
          )}
        </button>
      </div>

      {/* Contenu */}
      <div className="noise-content">
        {activeTab === 'monitor' && (
          <NoiseMonitor 
            currentNoise={currentNoise}
            onReadingSubmit={loadCurrentNoise}
          />
        )}

        {activeTab === 'history' && (
          <NoiseChart 
            history={history}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'alerts' && (
          <NoiseAlerts 
            alerts={alerts}
            onAlertResolved={loadAlerts}
            canManage={canManage}
          />
        )}

        {activeTab === 'settings' && canManage && (
          <NoiseSettings 
            settings={settings}
            onUpdate={handleSettingsUpdate}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default NoisePage;