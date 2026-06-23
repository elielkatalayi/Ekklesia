import apiService from './axios.config';

/**
 * Service API pour les annonces
 */
const announcementApi = {
  /**
   * Récupérer toutes les annonces
   * @param {Object} params - { page, limit, includeExpired }
   */
  getAnnouncements: (params = {}) => {
    console.log('📤 [API] getAnnouncements - Params:', params);
    return apiService.get('/announcement', params);
  },

  /**
   * Récupérer une annonce par ID
   * @param {string} id - ID de l'annonce
   */
  getAnnouncementById: (id) => {
    console.log('📤 [API] getAnnouncementById - ID:', id);
    return apiService.get(`/announcement/${id}`);
  },

  /**
   * Créer une annonce
   * @param {Object} data - { title, content, expiresAt, isImportant }
   */
  createAnnouncement: (data) => {
    console.log('📤 [API] createAnnouncement - Données reçues:');
    console.log('  - title:', data.title);
    console.log('  - content:', data.content);
    console.log('  - expiresAt:', data.expiresAt);
    console.log('  - isImportant:', data.isImportant);
    console.log('📤 [API] createAnnouncement - Body complet:', JSON.stringify(data, null, 2));
    
    return apiService.post('/announcement', data).catch(error => {
      console.error('❌ [API] Erreur createAnnouncement:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', error.response?.data);
      console.error('  - Message:', error.message);
      throw error;
    });
  },

  /**
   * Mettre à jour une annonce
   * @param {string} id - ID de l'annonce
   * @param {Object} data - { title, content, expiresAt, isImportant }
   */
  updateAnnouncement: (id, data) => {
    console.log('📤 [API] updateAnnouncement - ID:', id);
    console.log('📤 [API] updateAnnouncement - Données:', data);
    return apiService.put(`/announcement/${id}`, data);
  },

  /**
   * Supprimer une annonce
   * @param {string} id - ID de l'annonce
   */
  deleteAnnouncement: (id) => {
    console.log('📤 [API] deleteAnnouncement - ID:', id);
    return apiService.delete(`/announcement/${id}`);
  },

  /**
   * Uploader une image pour une annonce
   * @param {string} id - ID de l'annonce
   * @param {File} file - Fichier image
   * @param {Function} onProgress - Callback de progression
   */
  uploadImage: (id, file, onProgress) => {
    console.log('📤 [API] uploadImage - ID:', id);
    console.log('📤 [API] uploadImage - File:', file ? file.name : 'Aucun fichier');
    console.log('📤 [API] uploadImage - File size:', file ? file.size : 0);
    console.log('📤 [API] uploadImage - File type:', file ? file.type : 'N/A');
    
    return apiService.upload(`/announcement/${id}/image`, file, onProgress);
  },
};

export default announcementApi;