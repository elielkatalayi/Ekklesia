// components/services/VerseSelector.jsx

import React, { useState } from 'react';
import { BookOpen, X, Loader2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const VerseSelector = ({ bibleBooks, verseIds, setVerseIds }) => {
  const [selectedBook, setSelectedBook] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [verseNumber, setVerseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewVerses, setPreviewVerses] = useState([]);
  const [verseRange, setVerseRange] = useState(''); // ✅ Stocker la plage

  // ✅ Ajouter tout un chapitre (stocké comme plage)
  const addChapter = async () => {
    if (!selectedBook) {
      toast.error('Veuillez sélectionner un livre');
      return;
    }
    if (!chapterNumber || parseInt(chapterNumber) <= 0) {
      toast.error('Veuillez entrer un chapitre valide');
      return;
    }

    setIsLoading(true);
    try {
      const response = await bibleApi.getChapter('LSG1910', selectedBook, parseInt(chapterNumber));
      
      if (response.data.success) {
        const { bookName, chapter, totalVerses } = response.data.data.chapter;
        
        // ✅ Stocker la plage: "GEN 2:1-25" (chapitre entier)
        const range = `${selectedBook} ${chapter}:1-${totalVerses}`;
        
        // ✅ Ajouter la plage au lieu de tous les versets
        setVerseIds([...verseIds, range]);
        
        toast.success(`Chapitre ${chapter} de ${bookName} (${totalVerses} versets) ajouté`);
        setChapterNumber('');
        setPreviewVerses([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement chapitre:', error);
      toast.error('Erreur lors du chargement du chapitre');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Ajouter une plage personnalisée (ex: versets 1-9)
  const addVerseRange = () => {
    if (!selectedBook) {
      toast.error('Veuillez sélectionner un livre');
      return;
    }
    if (!chapterNumber || parseInt(chapterNumber) <= 0) {
      toast.error('Veuillez entrer un chapitre valide');
      return;
    }
    
    // ✅ Vérifier si c'est une plage (ex: 1-9)
    const rangeParts = verseNumber.split('-');
    if (rangeParts.length === 2) {
      const start = parseInt(rangeParts[0]);
      const end = parseInt(rangeParts[1]);
      if (start > 0 && end > 0 && start <= end) {
        const range = `${selectedBook} ${chapterNumber}:${start}-${end}`;
        if (!verseIds.includes(range)) {
          setVerseIds([...verseIds, range]);
          toast.success(`Versets ${start}-${end} ajoutés`);
          setChapterNumber('');
          setVerseNumber('');
          return;
        } else {
          toast.error('Cette plage est déjà ajoutée');
          return;
        }
      }
    }
    
    // ✅ Sinon, ajouter un seul verset
    const bookCode = selectedBook;
    const bookLabel = bibleBooks.find(b => b.value === selectedBook)?.label || selectedBook;
    const reference = `${bookCode} ${chapterNumber}:${verseNumber}`;
    const displayReference = `${bookLabel} ${chapterNumber}:${verseNumber}`;
    
    if (verseIds.includes(reference)) {
      toast.error('Ce verset est déjà ajouté');
      return;
    }
    
    setVerseIds([...verseIds, reference]);
    setChapterNumber('');
    setVerseNumber('');
    toast.success(`Verset ajouté: ${displayReference}`);
  };

  // ✅ Supprimer un verset ou une plage
  const removeVerse = (verse) => {
    setVerseIds(verseIds.filter(v => v !== verse));
  };

  // ✅ Aperçu du chapitre (pour voir ce qui va être ajouté)
  const handlePreview = async () => {
    if (!selectedBook) {
      toast.error('Veuillez sélectionner un livre');
      return;
    }
    if (!chapterNumber || parseInt(chapterNumber) <= 0) {
      toast.error('Veuillez entrer un chapitre valide');
      return;
    }

    setIsLoading(true);
    try {
      const response = await bibleApi.getChapter('LSG1910', selectedBook, parseInt(chapterNumber));
      if (response.data.success) {
        setPreviewVerses(response.data.data.chapter.verses);
        toast.success(`${response.data.data.chapter.totalVerses} versets trouvés`);
        setIsExpanded(true);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement');
      setPreviewVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPreview = () => {
    if (previewVerses.length === 0) return;
    const { chapter } = previewVerses[0];
    const range = `${selectedBook} ${chapter}:1-${previewVerses.length}`;
    if (!verseIds.includes(range)) {
      setVerseIds([...verseIds, range]);
      toast.success(`${previewVerses.length} versets ajoutés`);
    } else {
      toast.error('Ce chapitre est déjà ajouté');
    }
    setPreviewVerses([]);
    setChapterNumber('');
    setIsExpanded(false);
  };

  return (
    <div className="verse-selector">
      {/* Sélecteur de chapitre */}
      <div className="chapter-selector">
        <div className="chapter-selector-row">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="form-select chapter-book-select"
          >
            <option value="">Livre...</option>
            {bibleBooks.map((book) => (
              <option key={book.value} value={book.value}>
                {book.label}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            placeholder="Chapitre"
            className="form-input chapter-number-input"
            min="1"
          />
          
          <button
            type="button"
            onClick={addChapter}
            className="btn btn-primary add-chapter-btn"
            disabled={!selectedBook || !chapterNumber || isLoading}
          >
            {isLoading ? (
              <><Loader2 className="icon spin" /> Chargement...</>
            ) : (
              <><BookOpen className="icon" /> Ajouter le chapitre</>
            )}
          </button>
          
          <button
            type="button"
            onClick={handlePreview}
            className="btn btn-secondary preview-btn"
            disabled={!selectedBook || !chapterNumber || isLoading}
          >
            Aperçu
          </button>
        </div>
        <p className="form-help">📖 Sélectionnez un livre et un chapitre pour ajouter tous les versets</p>
      </div>

      {/* Aperçu */}
      {isExpanded && previewVerses.length > 0 && (
        <div className="preview-container">
          <div className="preview-header">
            <span>{previewVerses.length} versets trouvés</span>
            <button onClick={handleAddPreview} className="btn btn-primary">
              <Plus className="icon" /> Ajouter tout
            </button>
            <button onClick={() => setIsExpanded(false)} className="btn btn-secondary">
              <X className="icon" /> Fermer
            </button>
          </div>
          <div className="preview-verses">
            {previewVerses.slice(0, 5).map((v) => (
              <span key={v.verse} className="preview-verse">
                <span className="verse-num">{v.verse}</span>
                <span className="verse-text">{v.text.substring(0, 60)}...</span>
              </span>
            ))}
            {previewVerses.length > 5 && (
              <span className="preview-more">+ {previewVerses.length - 5} autres</span>
            )}
          </div>
        </div>
      )}

      <div className="verse-divider">OU</div>

      {/* Sélecteur individuel ou plage */}
      <div className="verse-input-group">
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="form-select verse-book-select"
        >
          <option value="">Livre...</option>
          {bibleBooks.map((book) => (
            <option key={book.value} value={book.value}>
              {book.label}
            </option>
          ))}
        </select>
        
        <input
          type="number"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
          placeholder="Chapitre"
          className="form-input verse-chapter-input"
          min="1"
        />
        
        <input
          type="text"
          value={verseNumber}
          onChange={(e) => setVerseNumber(e.target.value)}
          placeholder="1 ou 1-9"
          className="form-input verse-verse-input"
        />
        
        <button
          type="button"
          onClick={addVerseRange}
          className="add-verse-btn"
        >
          Ajouter
        </button>
      </div>
      <p className="form-help">Entrez un numéro de verset (ex: 5) ou une plage (ex: 1-9)</p>

      {/* Liste des versets/plages ajoutés */}
      {verseIds.length > 0 && (
        <div className="selected-verses-list">
          {verseIds.map((verse) => {
            const parts = verse.split(' ');
            const code = parts[0];
            const book = bibleBooks.find(b => b.value === code);
            const displayName = book ? book.label : code;
            const rest = parts.slice(1).join(' ');
            return (
              <span key={verse} className="selected-verse-tag">
                📖 {displayName} {rest}
                <button
                  type="button"
                  onClick={() => removeVerse(verse)}
                  className="remove-verse"
                >
                  <X className="icon" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VerseSelector;