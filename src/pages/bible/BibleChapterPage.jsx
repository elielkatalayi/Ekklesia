import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const BibleChapterPage = () => {
  const { bookId, chapter } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState([]);
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(parseInt(chapter));
  const [totalChapters, setTotalChapters] = useState(50);

  useEffect(() => {
    loadChapter();
  }, [bookId, currentChapter]);

  const loadChapter = async () => {
    setIsLoading(true);
    try {
      // Récupérer les infos du livre
      const bookResponse = await bibleApi.getBookByCode(bookId);
      if (bookResponse.data.success) {
        setBook(bookResponse.data.data.book);
        setTotalChapters(bookResponse.data.data.book.numberOfChapters || 50);
      }

      // Récupérer le chapitre
      const response = await bibleApi.getChapter('LSG1910', bookId, currentChapter);
      if (response.data.success) {
        const chapterData = response.data.data.chapter;
        setVerses(chapterData.verses || []);
      } else {
        toast.error('Chapitre non trouvé');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du chapitre');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      navigate(`/bible/${bookId}/${currentChapter - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < totalChapters) {
      setCurrentChapter(currentChapter + 1);
      navigate(`/bible/${bookId}/${currentChapter + 1}`);
    }
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
    <div className="bible-chapter-page">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/bible/${bookId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {book.name} {currentChapter}
            </h1>
            <p className="text-sm text-gray-500">
              {book.testament === 'OT' ? 'Ancien Testament' : 'Nouveau Testament'}
            </p>
          </div>
        </div>

        {/* Navigation des chapitres */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapter <= 1}
            className={`p-2 rounded-lg transition ${
              currentChapter <= 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">
            {currentChapter} / {totalChapters}
          </span>
          <button
            onClick={handleNextChapter}
            disabled={currentChapter >= totalChapters}
            className={`p-2 rounded-lg transition ${
              currentChapter >= totalChapters
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Versets */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {verses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun verset trouvé</p>
          </div>
        ) : (
          <div className="space-y-2">
            {verses.map((verse) => (
              <div
                key={verse.verse}
                className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer group"
              >
                <span className="text-sm font-bold text-primary-600 min-w-[30px]">
                  {verse.verse}
                </span>
                <span className="text-gray-700 leading-relaxed">
                  {verse.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleChapterPage;