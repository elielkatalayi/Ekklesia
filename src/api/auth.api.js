import apiService from './axios.config';

/**
 * Service d'authentification
 * Tous les appels API liés à l'authentification
 */
const authApi = {
  /**
   * Envoyer un OTP
   * @param {string} phoneNumber - Numéro de téléphone (format E.164)
   * @param {string} channel - 'sms' ou 'whatsapp'
   */
  sendOtp: (phoneNumber, channel = 'sms') => {
    return apiService.post('/auth/send-otp', { phoneNumber, channel });
  },

  /**
   * Vérifier l'OTP
   * @param {string} otpId - ID de l'OTP
   * @param {string} code - Code à 6 chiffres
   */
  verifyOtp: (otpId, code) => {
    return apiService.post('/auth/verify-otp', { otpId, code });
  },

  /**
   * Renvoyer l'OTP
   * @param {string} phoneNumber - Numéro de téléphone
   * @param {string} channel - 'sms' ou 'whatsapp'
   */
  resendOtp: (phoneNumber, channel = 'sms') => {
    return apiService.post('/auth/resend-otp', { phoneNumber, channel });
  },

  /**
   * Choisir une église (création du compte)
   * @param {string} phone - Numéro de téléphone
   * @param {string} churchId - ID de l'église
   * @param {string} name - Nom de l'utilisateur
   */
  chooseChurch: (phone, churchId, name) => {
    return apiService.post('/auth/choose-church', { phone, churchId, name });
  },

  /**
   * Récupérer la liste des églises
   */
  getChurches: () => {
    return apiService.get('/auth/churches');
  },

  /**
   * Vérifier si un utilisateur existe
   * @param {string} phone - Numéro de téléphone
   */
  checkUser: (phone) => {
    return apiService.post('/auth/check-user', { phone });
  },

  /**
   * Rafraîchir le token
   */
  refreshToken: () => {
    return apiService.post('/auth/refresh-token');
  },

  /**
   * Déconnexion
   */
  logout: () => {
    return apiService.post('/auth/logout');
  },

  /**
   * Compléter le profil
   * @param {Object} data - { name, email, photoUrl }
   */
  completeProfile: (data) => {
    return apiService.put('/auth/complete-profile', data);
  },
};

export default authApi;