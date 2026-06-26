import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, ChevronRight } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const BibleBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    loadBookAndChapters();
  }, [bookId]);

  const loadBookAndChapters = async () => {
    setIsLoading(true);
    try {
      // Récupérer les infos du livre
      const bookResponse = await bibleApi.getBookByCode(bookId);
      if (bookResponse.data.success) {
        setBook(bookResponse.data.data.book);
      }

      // Récupérer le chapitre 1 pour avoir le nombre de chapitres
      const chapterResponse = await bibleApi.getChapter('LSG1910', bookId, 1);
      if (chapterResponse.data.success) {
        const chapterData = chapterResponse.data.data.chapter;
        // Générer la liste des chapitres
        const totalChapters = 50; // Valeur par défaut, à remplacer par le vrai nombre
        const chapterList = Array.from({ length: totalChapters }, (_, i) => i + 1);
        setChapters(chapterList);
        setSelectedChapter(1);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du livre');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterClick = (chapterNumber) => {
    navigate(`/bible/${bookId}/${chapterNumber}`);
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
        <p className="text-gray-500">Livre non trouvé</p>
        <button onClick={() => navigate('/bible')} className="mt-4 text-primary-600 hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="bible-book-page">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/bible')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{book.name}</h1>
          <p className="text-sm text-gray-500">
            {book.testament === 'OT' ? 'Ancien Testament' : 'Nouveau Testament'}
          </p>
        </div>
      </div>

      {/* Chapitres */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() => handleChapterClick(chapter)}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-primary-300 transition-all text-center"
          >
            <span className="text-lg font-semibold text-gray-800">{chapter}</span>
          </button>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun chapitre disponible</p>
        </div>
      )}
    </div>
  );
};

export default BibleBookPage;