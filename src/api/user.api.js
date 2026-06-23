import apiService from './axios.config';

/**
 * Service API pour les utilisateurs
 */
const userApi = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getProfile: () => {
    return apiService.get('/user/profile');
  },

  /**
   * Mettre à jour le profil
   * @param {Object} data - { name, email }
   */
  updateProfile: (data) => {
    return apiService.put('/user/profile', data);
  },

  /**
   * Uploader l'avatar
   * @param {File} file - Fichier image
   * @param {Function} onProgress - Callback de progression
   */
  uploadAvatar: (file, onProgress) => {
    return apiService.upload('/user/avatar', file, onProgress);
  },

  /**
   * Mettre à jour le rôle d'un utilisateur (Pastor only)
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} data - { role }
   */
  updateRole: (userId, data) => {
    return apiService.put(`/user/${userId}/role`, data);
  },

  /**
   * Retirer un utilisateur de l'église (Pastor only)
   * @param {string} userId - ID de l'utilisateur
   */
  removeUser: (userId) => {
    return apiService.delete(`/user/${userId}`);
  },

  /**
   * Rechercher un utilisateur par téléphone
   * @param {string} phone - Numéro de téléphone
   */
  searchUser: (phone) => {
    return apiService.get('/user/search', { phone });
  },

  /**
   * Récupérer tous les utilisateurs de l'église
   * @param {Object} params - { page, limit, role, search }
   */
  getUsers: (params = {}) => {
    return apiService.get('/user', params);
  },
};

export default userApi;