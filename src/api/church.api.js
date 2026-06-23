import apiService from './axios.config';

/**
 * Service API pour la gestion de l'église
 */
const churchApi = {
  /**
   * Récupérer les détails d'une église
   * @param {string} churchId - ID de l'église
   */
  getChurch: (churchId) => {
    return apiService.get(`/church/${churchId}`);
  },

  /**
   * Mettre à jour une église
   * @param {string} churchId - ID de l'église
   * @param {Object} data - { name, address, phone, contactEmail, description }
   */
  updateChurch: (churchId, data) => {
    return apiService.put(`/church/${churchId}`, data);
  },

  /**
   * Récupérer les membres d'une église
   * @param {string} churchId - ID de l'église
   * @param {Object} params - { page, limit, role }
   */
  getMembers: (churchId, params = {}) => {
    return apiService.get(`/church/${churchId}/members`, params);
  },

  /**
   * Récupérer les statistiques d'une église
   * @param {string} churchId - ID de l'église
   */
  getStats: (churchId) => {
    return apiService.get(`/church/${churchId}/stats`);
  },

  /**
   * Uploader le logo de l'église
   * @param {string} churchId - ID de l'église
   * @param {File} file - Fichier image
   * @param {Function} onProgress - Callback de progression
   */
  uploadLogo: (churchId, file, onProgress) => {
    return apiService.upload(`/church/${churchId}/logo`, file, onProgress);
  },

  /**
   * Uploader la bannière de l'église
   * @param {string} churchId - ID de l'église
   * @param {File} file - Fichier image
   * @param {Function} onProgress - Callback de progression
   */
  uploadBanner: (churchId, file, onProgress) => {
    return apiService.upload(`/church/${churchId}/banner`, file, onProgress);
  },

  // =============================================
  // ADMIN ROUTES (Super Admin only)
  // =============================================

  /**
   * Récupérer toutes les églises (Admin seulement)
   * @param {Object} params - { page, limit, status }
   */
  getAllChurches: (params = {}) => {
    return apiService.get('/church', params);
  },
};

export default churchApi;