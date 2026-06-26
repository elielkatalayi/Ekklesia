import apiService from './axios.config';

/**
 * Service d'authentification - Version sans OTP
 */
const authApi = {
  /**
   * Récupérer toutes les églises disponibles
   */
  getChurches: () => {
    return apiService.get('/auth/churches');
  },

  /**
   * Récupérer les détails d'une église par code
   * @param {string} churchCode - Code de l'église
   */
  getChurchByCode: (churchCode) => {
    return apiService.get(`/auth/church/${churchCode}`);
  },

  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} data - { phone, name, churchId }
   */
  register: (data) => {
    return apiService.post('/auth/register', data);
  },

  /**
   * Connexion par numéro de téléphone
   * @param {Object} data - { phone, churchCode? }
   */
  login: (data) => {
    return apiService.post('/auth/login', data);
  },

  /**
   * Changer d'église visualisée
   * @param {Object} data - { churchCode }
   */
  switchChurch: (data) => {
    return apiService.post('/auth/switch-church', data);
  },

  /**
   * Récupérer le profil utilisateur
   */
  getMe: () => {
    return apiService.get('/auth/me');
  },

  /**
   * Déconnexion
   */
  logout: () => {
    return apiService.post('/auth/logout');
  },
};

export default authApi;