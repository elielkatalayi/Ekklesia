import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Calendar } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const BiblePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testament, setTestament] = useState('all'); // 'all' | 'OT' | 'NT'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, [testament]);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const params = testament !== 'all' ? { testament } : {};
      const response = await bibleApi.getBooks(params);
      if (response.data.success) {
        setBooks(response.data.data.books || []);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des livres');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookClick = (book) => {
    navigate(`/bible/${book.code}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement des livres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bible-page">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📖 Bible</h1>
        <span className="text-sm text-gray-500">Louis Segond 1910</span>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTestament('all')}
            className={`px-4 py-2 rounded-lg transition ${
              testament === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setTestament('OT')}
            className={`px-4 py-2 rounded-lg transition ${
              testament === 'OT'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ancien Testament
          </button>
          <button
            onClick={() => setTestament('NT')}
            className={`px-4 py-2 rounded-lg transition ${
              testament === 'NT'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Nouveau Testament
          </button>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un livre..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Liste des livres */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredBooks.map((book) => (
          <button
            key={book.id}
            onClick={() => handleBookClick(book)}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 transition-all text-left group"
          >
            <div className="text-xs font-bold text-primary-600 mb-1">{book.code}</div>
            <div className="text-sm font-medium text-gray-800 group-hover:text-primary-700 transition">
              {book.name}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {book.testament === 'OT' ? 'Ancien' : 'Nouveau'}
            </div>
          </button>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun livre trouvé</p>
        </div>
      )}
    </div>
  );
};

export default BiblePage;