import apiService from './axios.config';

/**
 * Service API pour les cantiques
 */
const hymnsApi = {
  // =============================================
  // HYMN BOOKS
  // =============================================
  
  getHymnBooks: () => {
    return apiService.get('/hymns/books');
  },

  createHymnBook: (data) => {
    return apiService.post('/hymns/books', data);
  },

  updateHymnBook: (id, data) => {
    return apiService.put(`/hymns/books/${id}`, data);
  },

  deleteHymnBook: (id) => {
    return apiService.delete(`/hymns/books/${id}`);
  },

  // =============================================
  // HYMN AUTHORS
  // =============================================

  getHymnAuthors: () => {
    return apiService.get('/hymns/authors');
  },

  createHymnAuthor: (data) => {
    return apiService.post('/hymns/authors', data);
  },

  updateHymnAuthor: (id, data) => {
    return apiService.put(`/hymns/authors/${id}`, data);
  },

  deleteHymnAuthor: (id) => {
    return apiService.delete(`/hymns/authors/${id}`);
  },

  // =============================================
  // OFFICIAL HYMNS
  // =============================================

  getHymns: (params = {}) => {
    return apiService.get('/hymns', params);
  },

  getHymnById: (id) => {
    return apiService.get(`/hymns/${id}`);
  },

  // ✅ AJOUTER CETTE FONCTION
  getHymnsByIds: (data) => {
    console.log('📤 [API] getHymnsByIds - IDs:', data.ids);
    return apiService.post('/hymns/by-ids', data);
  },

  createHymn: (data) => {
    return apiService.post('/hymns', data);
  },

  updateHymn: (id, data) => {
    return apiService.put(`/hymns/${id}`, data);
  },

  deleteHymn: (id) => {
    return apiService.delete(`/hymns/${id}`);
  },

  // =============================================
  // CHURCH HYMNS (Custom)
  // =============================================

  getChurchHymns: (params = {}) => {
    return apiService.get('/hymns/church', params);
  },

  createChurchHymn: (data) => {
    return apiService.post('/hymns/church', data);
  },

  updateChurchHymn: (id, data) => {
    return apiService.put(`/hymns/church/${id}`, data);
  },

  approveChurchHymn: (id) => {
    return apiService.put(`/hymns/church/${id}/approve`);
  },

  deleteChurchHymn: (id) => {
    return apiService.delete(`/hymns/church/${id}`);
  },

  // =============================================
  // FAVORITES
  // =============================================

  toggleFavorite: (data) => {
    return apiService.post('/hymns/favorite/toggle', data);
  },

  getFavorites: (params = {}) => {
    return apiService.get('/hymns/favorites', params);
  },

  // =============================================
  // PLAYLISTS
  // =============================================

  getPlaylists: () => {
    return apiService.get('/hymns/playlists');
  },

  createPlaylist: (data) => {
    return apiService.post('/hymns/playlists', data);
  },

  updatePlaylist: (id, data) => {
    return apiService.put(`/hymns/playlists/${id}`, data);
  },

  deletePlaylist: (id) => {
    return apiService.delete(`/hymns/playlists/${id}`);
  },

  addToPlaylist: (playlistId, data) => {
    return apiService.post(`/hymns/playlists/${playlistId}/add`, data);
  },

  removeFromPlaylist: (playlistId, hymnId) => {
    return apiService.delete(`/hymns/playlists/${playlistId}/remove/${hymnId}`);
  },
};

export default hymnsApi;