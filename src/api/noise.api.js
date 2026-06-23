import apiService from './axios.config';

/**
 * Service API pour la gestion du bruit
 */
const noiseApi = {
  /**
   * Envoyer une lecture de bruit
   * @param {Object} data - { dbValue, durationSeconds }
   */
  submitReading: (data) => {
    return apiService.post('/noise/reading', data);
  },

  /**
   * Récupérer le niveau de bruit actuel
   */
  getCurrentNoise: () => {
    return apiService.get('/noise/current');
  },

  /**
   * Récupérer les statistiques de bruit
   * @param {Object} params - { period: 'hour' | 'day' | 'week' | 'month' }
   */
  getStats: (params = {}) => {
    return apiService.get('/noise/stats', params);
  },

  /**
   * Récupérer l'historique du bruit (graphique)
   * @param {Object} params - { hours: 24 }
   */
  getHistory: (params = {}) => {
    return apiService.get('/noise/history', params);
  },

  /**
   * Récupérer le rapport quotidien
   * @param {Object} params - { date: 'YYYY-MM-DD' }
   */
  getReport: (params = {}) => {
    return apiService.get('/noise/report', params);
  },

  /**
   * Récupérer les alertes
   * @param {Object} params - { includeResolved: true/false }
   */
  getAlerts: (params = {}) => {
    return apiService.get('/noise/alerts', params);
  },

  /**
   * Résoudre une alerte (Moderator+ only)
   * @param {string} alertId - ID de l'alerte
   * @param {Object} data - { note }
   */
  resolveAlert: (alertId, data = {}) => {
    return apiService.put(`/noise/alerts/${alertId}/resolve`, data);
  },

  /**
   * Récupérer les paramètres de bruit de l'église
   */
  getSettings: () => {
    return apiService.get('/noise/settings');
  },

  /**
   * Mettre à jour les paramètres de bruit (Moderator+ only)
   * @param {Object} data - { thresholdMin, thresholdNormal, thresholdElevated, thresholdVeryHigh, thresholdDanger }
   */
  updateSettings: (data) => {
    return apiService.put('/noise/settings', data);
  },
};

export default noiseApi;