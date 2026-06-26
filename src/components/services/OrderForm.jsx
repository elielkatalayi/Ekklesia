// components/services/OrderForm.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Music, Search, X, ChevronUp, ChevronDown, BookOpen, Loader2 } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const visibilityOptions = [
  { value: 'everyone', label: 'Tout le monde' },
  { value: 'members_only', label: 'Membres seulement' },
  { value: 'moderator_only', label: 'Modérateurs seulement' },
  { value: 'after_service', label: 'Après le service' },
];

const OrderForm = ({ 
  onSubmit, 
  onCancel, 
  hymnBooks,
  selectedBookId,
  setSelectedBookId,
  filteredHymns,
  selectedHymns,
  toggleHymnSelection,
  isHymnSelected,
  searchHymnTerm,
  setSearchHymnTerm,
  isLoadingHymns,
  showHymnSelector,
  setShowHymnSelector,
  nextOrder,
  bibleBooks
}) => {
  const [formData, setFormData] = useState({
    order: nextOrder || 1,
    reference: '',
    customText: '',
    durationMinutes: '',
    visibility: 'everyone',
  });

  const [selectedBook, setSelectedBook] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [verseNumber, setVerseNumber] = useState('');
  const [verseIds, setVerseIds] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Mettre à jour la référence automatiquement (cachée)
  useEffect(() => {
    let reference = '';
    
    if (selectedHymns.length > 0) {
      const hymnRefs = selectedHymns.map(h => 
        h.number ? `n°${h.number}` : h.title
      ).join(', ');
      reference = `Cantique(s): ${hymnRefs}`;
    } else if (verseIds.length > 0) {
      const displayRefs = verseIds.map(ref => {
        const parts = ref.split(' ');
        const code = parts[0];
        const book = bibleBooks.find(b => b.value === code);
        return book ? `${book.label} ${parts.slice(1).join(' ')}` : ref;
      });
      reference = `Écriture(s): ${displayRefs.join(', ')}`;
    } else if (formData.customText && formData.customText.trim() !== '') {
      reference = formData.customText;
    }
    
    setFormData(prev => ({
      ...prev,
      reference: reference
    }));
  }, [selectedHymns, verseIds, formData.customText, bibleBooks]);

  // ✅ Ajouter un chapitre ou un verset
  const addVerseOrChapter = () => {
    if (!selectedBook) {
      toast.error('Veuillez sélectionner un livre');
      return;
    }
    if (!chapterNumber || parseInt(chapterNumber) <= 0) {
      toast.error('Veuillez entrer un chapitre valide');
      return;
    }

    const bookCode = selectedBook;
    const bookLabel = bibleBooks.find(b => b.value === selectedBook)?.label || selectedBook;

    // ✅ Si un verset est spécifié, ajouter le verset
    if (verseNumber && parseInt(verseNumber) > 0) {
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
    } else {
      // ✅ Sinon, ajouter tout le chapitre (une seule référence)
      const chapterRef = `${bookCode} ${chapterNumber}`;
      const displayChapter = `${bookLabel} ${chapterNumber}`;
      
      // ✅ Vérifier si le chapitre est déjà ajouté
      const existingChapter = verseIds.some(id => id === chapterRef || id.startsWith(`${bookCode} ${chapterNumber}:`));
      
      if (existingChapter) {
        toast.error('Ce chapitre est déjà ajouté');
        return;
      }
      
      setVerseIds([...verseIds, chapterRef]);
      setChapterNumber('');
      setVerseNumber('');
      toast.success(`Chapitre ${chapterNumber} de ${bookLabel} ajouté`);
    }
  };

  const removeVerse = (verse) => {
    setVerseIds(verseIds.filter(v => v !== verse));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customText && selectedHymns.length === 0 && verseIds.length === 0) {
      toast.error('Veuillez remplir au moins un champ (cantique, verset ou texte personnalisé)');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        verseIds: verseIds
      });
      setVerseIds([]);
      setSelectedBook('');
      setChapterNumber('');
      setVerseNumber('');
      setFormData(prev => ({ ...prev, customText: '', reference: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {/* ✅ Position affichée en haut en lecture seule */}
      <div className="position-display">
        <span className="position-label">Position</span>
        <span className="position-value">{formData.order}</span>
      </div>

      {/* ✅ Sélecteur de cantiques */}
      <div className="form-group hymn-selector-group" ref={dropdownRef}>
        <label className="form-label">
          Cantiques <span className="optional">(optionnel)</span>
        </label>
        
        <button
          type="button"
          className="hymn-selector-toggle"
          onClick={() => setShowHymnSelector(!showHymnSelector)}
        >
          <Music className="icon" />
          {selectedHymns.length > 0 
            ? `${selectedHymns.length} cantique(s) sélectionné(s)` 
            : 'Choisir des cantiques'}
          {showHymnSelector ? <ChevronUp className="icon" /> : <ChevronDown className="icon" />}
        </button>

        {selectedHymns.length > 0 && (
          <div className="selected-hymns-list">
            {selectedHymns.map((hymn) => (
              <span key={hymn.id} className="selected-hymn-tag">
                {hymn.number ? `n°${hymn.number}` : ''} {hymn.title}
                <button
                  type="button"
                  onClick={() => toggleHymnSelection(hymn)}
                  className="remove-hymn"
                >
                  <X className="icon" />
                </button>
              </span>
            ))}
          </div>
        )}

        {showHymnSelector && (
          <div className="hymn-selector-dropdown">
            <div className="hymn-selector-header">
              <span className="hymn-selector-title">📖 Sélectionner des cantiques</span>
              <button
                type="button"
                className="hymn-selector-close"
                onClick={() => setShowHymnSelector(false)}
              >
                <X className="icon" />
              </button>
            </div>
            
            <div className="hymn-book-selector">
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="form-select"
              >
                <option value="">Sélectionner un recueil...</option>
                {hymnBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedBookId && (
              <div className="hymn-search">
                <Search className="icon" />
                <input
                  type="text"
                  value={searchHymnTerm}
                  onChange={(e) => setSearchHymnTerm(e.target.value)}
                  placeholder="Rechercher un cantique..."
                  className="form-input"
                />
              </div>
            )}

            {selectedBookId && (
              <div className="hymn-list">
                {isLoadingHymns ? (
                  <div className="loading-spinner">Chargement...</div>
                ) : filteredHymns.length === 0 ? (
                  <div className="no-hymns">
                    <p>Aucun cantique trouvé</p>
                  </div>
                ) : (
                  filteredHymns.map((hymn) => (
                    <div
                      key={hymn.id}
                      className={`hymn-item ${isHymnSelected(hymn.id) ? 'selected' : ''}`}
                      onClick={() => toggleHymnSelection(hymn)}
                    >
                      <div className="hymn-item-info">
                        <span className="hymn-number">#{hymn.number || '?'}</span>
                        <span className="hymn-title">{hymn.title}</span>
                      </div>
                      {isHymnSelected(hymn.id) && (
                        <span className="hymn-check">✓</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Sélecteur de versets - SIMPLIFIÉ */}
      <div className="form-group verse-selector-group">
        <label className="form-label">
          Versets bibliques <span className="optional">(optionnel)</span>
        </label>
        
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
            type="number"
            value={verseNumber}
            onChange={(e) => setVerseNumber(e.target.value)}
            placeholder="Verset (optionnel)"
            className="form-input verse-verse-input"
            min="1"
          />
          
          <button
            type="button"
            onClick={addVerseOrChapter}
            className="btn btn-primary add-verse-btn"
            disabled={!selectedBook || !chapterNumber}
          >
            <BookOpen className="icon" /> {verseNumber ? 'Ajouter le verset' : 'Ajouter le chapitre'}
          </button>
        </div>
        <p className="form-help">
          📖 Entrez un chapitre pour ajouter tout le chapitre, ou ajoutez un numéro de verset pour un verset spécifique
        </p>

        {/* ✅ Affichage des versets/chapitres ajoutés */}
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

      {/* ✅ Texte personnalisé */}
      <div className="form-group">
        <label className="form-label">
          Texte personnalisé <span className="optional">(optionnel)</span>
        </label>
        <input
          type="text"
          name="customText"
          value={formData.customText}
          onChange={handleChange}
          placeholder="Entrez votre texte personnalisé..."
          className="form-input"
        />
        <p className="form-help">✏️ Vous pouvez écrire ce que vous voulez ici</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Durée (minutes) <span className="optional">(optionnel)</span></label>
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            placeholder="15"
            className="form-input"
            min="1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Visibilité</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="form-select"
          >
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;