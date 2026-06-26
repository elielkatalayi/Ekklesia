import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Music, Search, Heart, Play } from 'lucide-react';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const HymnBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [hymns, setHymns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [favorites, setFavorites] = useState([]);

  const canManage = ['pastor', 'moderator', 'deacon'].includes(user?.role);

  useEffect(() => {
    loadBookAndHymns();
  }, [bookId, pagination.page]);

  const loadBookAndHymns = async () => {
    setIsLoading(true);
    try {
      // Récupérer les infos du recueil
      const booksResponse = await hymnsApi.getHymnBooks();
      if (booksResponse.data.success) {
        const foundBook = booksResponse.data.data.books.find(b => b.id === bookId);
        setBook(foundBook);
      }

      // Récupérer les cantiques
      const params = { bookId, page: pagination.page, limit: pagination.limit };
      if (searchTerm) params.search = searchTerm;
      
      const response = await hymnsApi.getHymns(params);
      if (response.data.success) {
        setHymns(response.data.data.hymns || []);
        setPagination(response.data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des cantiques');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHymnClick = (hymn) => {
    navigate(`/hymns/${bookId}/${hymn.id}`);
  };

  const toggleFavorite = async (hymnId, e) => {
    e.stopPropagation();
    try {
      const response = await hymnsApi.toggleFavorite({ hymnId });
      if (response.data.success) {
        const isFavorite = response.data.data.isFavorite;
        setFavorites(prev => 
          isFavorite ? [...prev, hymnId] : prev.filter(id => id !== hymnId)
        );
        toast.success(isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadBookAndHymns();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Recueil non trouvé</p>
        <button onClick={() => navigate('/hymns')} className="mt-4 text-primary-600 hover:underline">
          Retour aux recueils
        </button>
      </div>
    );
  }

  return (
    <div className="hymn-book-page">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/hymns')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{book.name}</h1>
          {book.description && (
            <p className="text-sm text-gray-500">{book.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {pagination.total} cantiques
          </p>
        </div>
      </div>

      {/* Recherche */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un cantique (titre, numéro)..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Rechercher
        </button>
      </form>

      {/* Liste des cantiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hymns.map((hymn) => (
          <button
            key={hymn.id}
            onClick={() => handleHymnClick(hymn)}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 transition-all text-left group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-primary-600">
                    #{hymn.number || '?'}
                  </span>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-700 transition line-clamp-1">
                    {hymn.title}
                  </h3>
                </div>
                {hymn.hymnBook && (
                  <p className="text-xs text-gray-400">{hymn.hymnBook.name}</p>
                )}
                {hymn.author && (
                  <p className="text-xs text-gray-500">par {hymn.author.name}</p>
                )}
                {hymn.chorus && (
                  <p className="text-xs text-gray-400 italic line-clamp-1 mt-1">
                    "{hymn.chorus.substring(0, 60)}..."
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => toggleFavorite(hymn.id, e)}
                  className={`p-2 rounded-lg transition ${
                    favorites.includes(hymn.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(hymn.id) ? 'fill-current' : ''}`} />
                </button>
                <Play className="h-4 w-4 text-gray-300 group-hover:text-primary-400 transition" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {hymns.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun cantique trouvé</p>
          {canManage && (
            <button
              onClick={() => navigate(`/hymns/create?bookId=${bookId}`)}
              className="mt-4 text-primary-600 hover:underline"
            >
              Ajouter un cantique
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} sur {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default HymnBookPage;