import apiService from './axios.config';

/**
 * Service API pour les services (cultes)
 */
const serviceApi = {
  /**
   * Récupérer tous les services
   * @param {Object} params - { page, limit, fromDate, toDate, published }
   */
  getServices: (params = {}) => {
    return apiService.get('/service', params);
  },

  /**
   * Récupérer un service par ID
   * @param {string} id - ID du service
   */
  getServiceById: (id) => {
    return apiService.get(`/service/${id}`);
  },

  /**
   * Créer un service
   * @param {Object} data - { date, title, startTime, endTime, description }
   */
  createService: (data) => {
    return apiService.post('/service', data);
  },

  /**
   * Mettre à jour un service
   * @param {string} id - ID du service
   * @param {Object} data - { title, startTime, endTime, description }
   */
  updateService: (id, data) => {
    return apiService.put(`/service/${id}`, data);
  },

  /**
   * Publier un service
   * @param {string} id - ID du service
   */
  publishService: (id) => {
    return apiService.post(`/service/${id}/publish`);
  },

  /**
   * Supprimer un service
   * @param {string} id - ID du service
   */
  deleteService: (id) => {
    return apiService.delete(`/service/${id}`);
  },
};

export default serviceApi;