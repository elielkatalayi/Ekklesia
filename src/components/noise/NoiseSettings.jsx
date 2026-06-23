import React, { useState } from 'react';
import { Save, Loader2, RefreshCw } from 'lucide-react';
import noiseApi from '../../api/noise.api';
import toast from 'react-hot-toast';

const NoiseSettings = ({ settings, onUpdate, isLoading: parentLoading }) => {
  const [formData, setFormData] = useState({
    thresholdMin: settings?.thresholdMin || 30,
    thresholdNormal: settings?.thresholdNormal || 70,
    thresholdElevated: settings?.thresholdElevated || 85,
    thresholdVeryHigh: settings?.thresholdVeryHigh || 100,
    thresholdDanger: settings?.thresholdDanger || 110,
    averagingPeriod: settings?.averagingPeriod || 30,
    alertDelay: settings?.alertDelay || 5,
    autoAdjustVolume: settings?.autoAdjustVolume || false,
    autoMute: settings?.autoMute || false,
    notifyPastor: settings?.notifyPastor || true,
    notifySoundTech: settings?.notifySoundTech || true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await noiseApi.updateSettings(formData);
      if (response.data.success) {
        onUpdate(response.data.data.settings);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser les paramètres par défaut ?')) {
      setFormData({
        thresholdMin: 30,
        thresholdNormal: 70,
        thresholdElevated: 85,
        thresholdVeryHigh: 100,
        thresholdDanger: 110,
        averagingPeriod: 30,
        alertDelay: 5,
        autoAdjustVolume: false,
        autoMute: false,
        notifyPastor: true,
        notifySoundTech: true,
      });
      toast.info('Paramètres réinitialisés');
    }
  };

  return (
    <div className="noise-settings">
      <div className="settings-header">
        <h3>⚙️ Paramètres de bruit</h3>
        <button className="reset-btn" onClick={handleReset}>
          <RefreshCw className="icon" /> Réinitialiser
        </button>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h4>Seuils (décibels)</h4>
          <div className="settings-grid">
            <div className="form-group">
              <label className="form-label">Silence (min)</label>
              <input
                type="number"
                name="thresholdMin"
                value={formData.thresholdMin}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="40"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Normal (max)</label>
              <input
                type="number"
                name="thresholdNormal"
                value={formData.thresholdNormal}
                onChange={handleChange}
                className="form-input"
                min="40"
                max="80"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Élevé</label>
              <input
                type="number"
                name="thresholdElevated"
                value={formData.thresholdElevated}
                onChange={handleChange}
                className="form-input"
                min="70"
                max="90"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Très élevé</label>
              <input
                type="number"
                name="thresholdVeryHigh"
                value={formData.thresholdVeryHigh}
                onChange={handleChange}
                className="form-input"
                min="85"
                max="105"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dangereux</label>
              <input
                type="number"
                name="thresholdDanger"
                value={formData.thresholdDanger}
                onChange={handleChange}
                className="form-input"
                min="100"
                max="120"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4>Périodes</h4>
          <div className="settings-grid">
            <div className="form-group">
              <label className="form-label">Période de calcul (secondes)</label>
              <input
                type="number"
                name="averagingPeriod"
                value={formData.averagingPeriod}
                onChange={handleChange}
                className="form-input"
                min="5"
                max="120"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Délai d'alerte (secondes)</label>
              <input
                type="number"
                name="alertDelay"
                value={formData.alertDelay}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4>Actions automatiques</h4>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="autoAdjustVolume"
                  checked={formData.autoAdjustVolume}
                  onChange={handleChange}
                />
                <span>Ajuster automatiquement le volume</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="autoMute"
                  checked={formData.autoMute}
                  onChange={handleChange}
                />
                <span>Couper automatiquement le son en cas de danger</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4>Notifications</h4>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifyPastor"
                  checked={formData.notifyPastor}
                  onChange={handleChange}
                />
                <span>Notifier le pasteur</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifySoundTech"
                  checked={formData.notifySoundTech}
                  onChange={handleChange}
                />
                <span>Notifier le technicien son</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={isLoading || parentLoading}>
            {isLoading ? (
              <><Loader2 className="icon spin" /> Enregistrement...</>
            ) : (
              <><Save className="icon" /> Enregistrer les paramètres</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoiseSettings;