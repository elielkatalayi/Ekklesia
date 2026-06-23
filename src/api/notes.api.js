import apiService from './axios.config';

/**
 * Service API pour les notes personnelles
 */
const notesApi = {
  /**
   * Récupérer toutes les notes de l'utilisateur
   */
  getNotes: () => {
    return apiService.get('/note');
  },

  /**
   * Récupérer les notes par référence (ex: Jean 3:16)
   * @param {string} referenceType - 'bible' ou 'song'
   * @param {string} reference - Référence (ex: 'Jean 3:16')
   */
  getNotesByReference: (referenceType, reference) => {
    return apiService.get(`/note/reference/${referenceType}/${encodeURIComponent(reference)}`);
  },

  /**
   * Créer une note
   * @param {Object} data - { referenceType, reference, content, color }
   */
  createNote: (data) => {
    return apiService.post('/note', data);
  },

  /**
   * Mettre à jour une note
   * @param {string} noteId - ID de la note
   * @param {Object} data - { content, color }
   */
  updateNote: (noteId, data) => {
    return apiService.put(`/note/${noteId}`, data);
  },

  /**
   * Supprimer une note
   * @param {string} noteId - ID de la note
   */
  deleteNote: (noteId) => {
    return apiService.delete(`/note/${noteId}`);
  },
};

export default notesApi;