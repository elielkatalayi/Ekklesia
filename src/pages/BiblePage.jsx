import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Calendar, Book, ChevronRight, ChevronLeft } from 'lucide-react';
import bibleApi from '../api/bible.api';
import BibleReader from '../components/bible/BibleReader';
import BibleSearch from '../components/bible/BibleSearch';
import VerseOfTheDay from '../components/bible/VerseOfTheDay';
import PersonalNotes from '../components/bible/PersonalNotes';

const BiblePage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [verses, setVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('read'); // 'read' | 'search' | 'notes'
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showNotes, setShowNotes] = useState(false);

  // ✅ Une seule traduction - celle qui existe en base
  const selectedTranslation = 'LSG1910';

  // Charger les livres au montage
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const response = await bibleApi.getBooks();
      if (response.data.success) {
        setBooks(response.data.data.books || []);
      }
    } catch (error) {
      console.error('Erreur chargement livres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChapter = async (bookCode, chapterNumber) => {
    setIsLoading(true);
    try {
      const response = await bibleApi.getChapter(selectedTranslation, bookCode, chapterNumber);
      if (response.data.success) {
        const chapterData = response.data.data.chapter;
        setVerses(chapterData.verses || []);
        setSelectedChapter(chapterNumber);
      }
    } catch (error) {
      console.error('Erreur chargement chapitre:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setVerses([]);
    // Générer les chapitres (1 à numberOfChapters)
    const chapterList = Array.from({ length: book.numberOfChapters || 50 }, (_, i) => i + 1);
    setChapters(chapterList);
    // Charger automatiquement le premier chapitre
    loadChapter(book.code, 1);
  };

  const handleChapterSelect = (chapterNumber) => {
    if (selectedBook) {
      loadChapter(selectedBook.code, chapterNumber);
    }
  };

  const handleVerseClick = (verse) => {
    setSelectedVerse(verse);
    setShowNotes(true);
  };

  return (
    <div className="bible-page">
      <div className="page-header">
        <h1 className="page-title">📖 Bible</h1>
        <div className="header-actions">
          <span className="translation-badge">
            📚 Louis Segond 1910
          </span>
        </div>
      </div>

      {/* Onglets */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => setActiveTab('read')}
        >
          <Book className="icon" /> Lecture
        </button>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search className="icon" /> Recherche
        </button>
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <BookOpen className="icon" /> Notes
        </button>
      </div>

      {/* Contenu */}
      <div className="tab-content">
        {activeTab === 'read' && (
          <div className="bible-reader-layout">
            {/* Liste des livres */}
            <div className="books-list">
              <h3>Livres</h3>
              <div className="books-grid">
                {books.map((book) => (
                  <button
                    key={book.id}
                    className={`book-btn ${selectedBook?.id === book.id ? 'active' : ''}`}
                    onClick={() => handleBookSelect(book)}
                  >
                    <span className="book-code">{book.code}</span>
                    <span className="book-name">{book.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lecteur */}
            <div className="reader-container">
              {selectedBook ? (
                <>
                  <div className="reader-header">
                    <h2>{selectedBook.name}</h2>
                    <div className="chapter-nav">
                      <button
                        onClick={() => {
                          if (selectedChapter > 1) {
                            handleChapterSelect(selectedChapter - 1);
                          }
                        }}
                        disabled={selectedChapter <= 1}
                        className="nav-btn"
                      >
                        <ChevronLeft className="icon" />
                      </button>
                      <select
                        value={selectedChapter || 1}
                        onChange={(e) => handleChapterSelect(parseInt(e.target.value))}
                        className="chapter-select"
                      >
                        {chapters.map((ch) => (
                          <option key={ch} value={ch}>
                            Chapitre {ch}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          if (selectedChapter < chapters.length) {
                            handleChapterSelect(selectedChapter + 1);
                          }
                        }}
                        disabled={selectedChapter >= chapters.length}
                        className="nav-btn"
                      >
                        <ChevronRight className="icon" />
                      </button>
                    </div>
                  </div>

                  <BibleReader
                    verses={verses}
                    isLoading={isLoading}
                    onVerseClick={handleVerseClick}
                    bookName={selectedBook.name}
                    chapter={selectedChapter}
                  />
                </>
              ) : (
                <div className="empty-state">
                  <Book className="icon large" />
                  <h3>Sélectionnez un livre</h3>
                  <p>Choisissez un livre dans la liste de gauche pour commencer la lecture</p>
                </div>
              )}
            </div>

            {/* Notes panel */}
            {showNotes && selectedVerse && (
              <div className="notes-panel">
                <PersonalNotes
                  verse={selectedVerse}
                  bookName={selectedBook?.name}
                  onClose={() => setShowNotes(false)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <BibleSearch translation={selectedTranslation} />
        )}

        {activeTab === 'notes' && (
          <div className="notes-list-container">
            <h2>📝 Mes notes personnelles</h2>
            <PersonalNotes showAll={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BiblePage;