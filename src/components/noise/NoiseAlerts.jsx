import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, User, Loader2 } from 'lucide-react';
import noiseApi from '../../api/noise.api';
import { formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const NoiseAlerts = ({ alerts, onAlertResolved, canManage }) => {
  const [resolvingId, setResolvingId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  const filteredAlerts = showResolved 
    ? alerts 
    : alerts.filter(a => a.status === 'active');

  const handleResolve = async (alertId) => {
    setResolvingId(alertId);
    try {
      const response = await noiseApi.resolveAlert(alertId, { 
        note: 'Alert resolved' 
      });
      if (response.data.success) {
        toast.success('Alerte résolue');
        onAlertResolved();
      }
    } catch (error) {
      toast.error('Erreur lors de la résolution');
    } finally {
      setResolvingId(null);
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'danger_noise': return '🚨';
      case 'high_noise': return '🔊';
      case 'low_signal': return '🔇';
      default: return '⚠️';
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'danger_noise': return 'alert-danger';
      case 'high_noise': return 'alert-high';
      case 'low_signal': return 'alert-low';
      default: return 'alert-default';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="alerts-empty">
        <CheckCircle className="icon large" />
        <h3>Aucune alerte</h3>
        <p>Tout est calme, aucun problème détecté</p>
      </div>
    );
  }

  return (
    <div className="noise-alerts">
      <div className="alerts-header">
        <h3>🚨 Alertes de bruit</h3>
        <button
          className="toggle-btn"
          onClick={() => setShowResolved(!showResolved)}
        >
          {showResolved ? 'Masquer résolues' : 'Voir toutes'}
        </button>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="alerts-none">
            <CheckCircle className="icon" />
            <span>Aucune alerte active</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${getAlertColor(alert.alertType)}`}>
              <div className="alert-icon">
                {getAlertIcon(alert.alertType)}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-type">{alert.alertType.replace('_', ' ').toUpperCase()}</span>
                  <span className="alert-time">
                    <Clock className="icon" /> {formatDateTime(alert.createdAt)}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-details">
                  <span className="alert-db">Niveau: {alert.dbValue} dB</span>
                  <span className="alert-threshold">Seuil: {alert.threshold} dB</span>
                </div>
                {alert.recommendedAction && (
                  <p className="alert-action">💡 {alert.recommendedAction}</p>
                )}
                {alert.status === 'resolved' && (
                  <div className="alert-resolved">
                    <CheckCircle className="icon" />
                    <span>Résolue par {alert.resolver?.name || 'Inconnu'}</span>
                    <span className="alert-resolved-time">
                      {formatDateTime(alert.resolvedAt)}
                    </span>
                  </div>
                )}
              </div>
              {alert.status === 'active' && canManage && (
                <button
                  className="resolve-btn"
                  onClick={() => handleResolve(alert.id)}
                  disabled={resolvingId === alert.id}
                >
                  {resolvingId === alert.id ? (
                    <Loader2 className="icon spin" />
                  ) : (
                    <CheckCircle className="icon" />
                  )}
                  Résoudre
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoiseAlerts;