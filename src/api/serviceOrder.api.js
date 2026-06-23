import apiService from './axios.config';

/**
 * Service API pour l'ordre des services
 */
const serviceOrderApi = {
  /**
   * Récupérer tous les ordres d'un service
   * @param {string} serviceId - ID du service
   */
  getOrdersByService: (serviceId) => {
    return apiService.get(`/service-order/service/${serviceId}`);
  },

  /**
   * Créer un ordre
   * @param {Object} data - { serviceId, order, itemType, reference, customText, durationMinutes, visibility }
   */
  createOrder: (data) => {
    return apiService.post('/service-order', data);
  },

  /**
   * Mettre à jour un ordre
   * @param {string} id - ID de l'ordre
   * @param {Object} data - { order, reference, customText, durationMinutes, visibility }
   */
  updateOrder: (id, data) => {
    return apiService.put(`/service-order/${id}`, data);
  },

  /**
   * Réorganiser les ordres (drag & drop)
   * @param {Object} data - { serviceId, orders: [{ id, order }] }
   */
  reorderOrders: (data) => {
    return apiService.put('/service-order/reorder', data);
  },

  /**
   * Supprimer un ordre
   * @param {string} id - ID de l'ordre
   */
  deleteOrder: (id) => {
    return apiService.delete(`/service-order/${id}`);
  },
};

export default serviceOrderApi;