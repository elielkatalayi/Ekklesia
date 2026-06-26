import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, BookOpen, Search, Plus } from 'lucide-react';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const HymnsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hymnCounts, setHymnCounts] = useState({});

  const canManage = ['pastor', 'moderator', 'deacon'].includes(user?.role);

  useEffect(() => {
    loadHymnBooks();
  }, []);

  const loadHymnBooks = async () => {
    setIsLoading(true);
    try {
      const response = await hymnsApi.getHymnBooks();
      if (response.data.success) {
        setBooks(response.data.data.books || []);
        // Charger le nombre de cantiques par recueil
        for (const book of response.data.data.books) {
          const hymnsResponse = await hymnsApi.getHymns({ bookId: book.id, limit: 1 });
          if (hymnsResponse.data.success) {
            setHymnCounts(prev => ({
              ...prev,
              [book.id]: hymnsResponse.data.data.pagination?.total || 0
            }));
          }
        }
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des recueils');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookClick = (book) => {
    navigate(`/hymns/${book.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement des recueils...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hymns-page">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎵 Cantiques</h1>
        {canManage && (
          <button
            onClick={() => navigate('/hymns/create')}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="h-4 w-4" />
            Ajouter un cantique
          </button>
        )}
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un recueil..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>

      {/* Liste des recueils */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <button
            key={book.id}
            onClick={() => handleBookClick(book)}
            className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 transition-all text-left group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-700 transition">
                    {book.name}
                  </h3>
                </div>
                {book.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{book.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400">
                    {hymnCounts[book.id] || 0} cantiques
                  </span>
                </div>
              </div>
              <Music className="h-5 w-5 text-gray-300 group-hover:text-primary-400 transition" />
            </div>
          </button>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun recueil trouvé</p>
          {canManage && (
            <button
              onClick={() => navigate('/hymns/create')}
              className="mt-4 text-primary-600 hover:underline"
            >
              Créer un recueil
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HymnsPage;