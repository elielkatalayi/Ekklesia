import apiService from './axios.config';

/**
 * Service API pour la Bible
 */
const bibleApi = {
  /**
   * Récupérer toutes les traductions
   */
  getTranslations: () => {
    return apiService.get('/bible/translations');
  },

  /**
   * Récupérer tous les livres
   * @param {string} testament - 'AT' ou 'NT' (optionnel)
   */
  getBooks: (testament = null) => {
    const params = testament ? { testament } : {};
    return apiService.get('/bible/books', params);
  },

  /**
   * Récupérer un livre par son code
   * @param {string} code - Code du livre (ex: 'JHN')
   */
  getBookByCode: (code) => {
    return apiService.get(`/bible/book/${code}`);
  },

  /**
   * Récupérer un verset spécifique
   * @param {string} translation - Code de la traduction
   * @param {string} book - Code du livre
   * @param {number} chapter - Numéro du chapitre
   * @param {number} verse - Numéro du verset
   */
  getVerse: (translation, book, chapter, verse) => {
    return apiService.get('/bible/verse', { translation, book, chapter, verse });
  },

  /**
   * Récupérer un chapitre complet
   * @param {string} translation - Code de la traduction
   * @param {string} book - Code du livre
   * @param {number} chapter - Numéro du chapitre
   */
  getChapter: (translation, book, chapter) => {
    return apiService.get('/bible/chapter', { translation, book, chapter });
  },

  /**
   * Récupérer une plage de versets
   * @param {string} translation - Code de la traduction
   * @param {string} book - Code du livre
   * @param {number} chapter - Numéro du chapitre
   * @param {number} start - Verset de début
   * @param {number} end - Verset de fin
   */
  getVersesRange: (translation, book, chapter, start, end) => {
    return apiService.get('/bible/range', { translation, book, chapter, start, end });
  },

  /**
   * Rechercher des versets
   * @param {string} query - Mot-clé à rechercher
   * @param {string} translation - Code de la traduction
   * @param {number} limit - Nombre de résultats
   */
  searchVerses: (query, translation = 'ostervald', limit = 20) => {
    return apiService.get('/bible/search', { q: query, translation, limit });
  },

  /**
   * Récupérer un verset aléatoire
   * @param {string} translation - Code de la traduction
   */
  getRandomVerse: (translation = 'ostervald') => {
    return apiService.get('/bible/random', { translation });
  },

  /**
   * Récupérer le verset du jour
   * @param {string} translation - Code de la traduction
   */
  getVerseOfTheDay: (translation = 'ostervald') => {
    return apiService.get('/bible/verse-of-the-day', { translation });
  },
};

export default bibleApi;