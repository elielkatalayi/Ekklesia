// api/serviceOrder.api.js

import apiService from './axios.config';

const serviceOrderApi = {
  getOrdersByService: (serviceId) => {
    console.log('📤 [API] getOrdersByService - serviceId:', serviceId);
    return apiService.get(`/service-order/service/${serviceId}`);
  },

// api/serviceOrder.api.js

createOrder: (data) => {
  console.log('📤 [API] createOrder - Données envoyées:', JSON.stringify(data, null, 2));
  
  return apiService.post('/service-order', data)
    .then(response => {
      console.log('✅ [API] Réponse succès:', response.data);
      return response;
    })
    .catch(error => {
      console.error('❌ [API] ===== ERREUR BACKEND =====');
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Message:', error.response?.data?.message);
      console.error('❌ Error code:', error.response?.data?.error?.code);
      
      // ✅ AFFICHER LES DÉTAILS COMPLETS
      const details = error.response?.data?.error?.details;
      console.error('❌ Détails (complets):', JSON.stringify(details, null, 2));
      
      if (Array.isArray(details)) {
        details.forEach((detail, index) => {
          console.error(`❌ Détail ${index + 1}:`, {
            field: detail.field,
            message: detail.message
          });
        });
      }
      
      console.error('❌ Données complètes:', JSON.stringify(error.response?.data, null, 2));
      console.error('❌ ===============================');
      throw error;
    });
},

  updateOrder: (id, data) => {
    console.log('📤 [API] updateOrder - ID:', id);
    console.log('📤 [API] updateOrder - Données:', JSON.stringify(data, null, 2));
    return apiService.put(`/service-order/${id}`, data);
  },

  reorderOrders: (data) => {
    console.log('📤 [API] reorderOrders - Données:', JSON.stringify(data, null, 2));
    return apiService.put('/service-order/reorder', data);
  },

  deleteOrder: (id) => {
    console.log('📤 [API] deleteOrder - ID:', id);
    return apiService.delete(`/service-order/${id}`);
  },
};

export default serviceOrderApi; 