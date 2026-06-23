import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const BibleSearch = ({ translation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);
    try {
      const response = await bibleApi.searchVerses(query, translation);
      if (response.data.success) {
        setResults(response.data.data.results || []);
        if (response.data.data.results?.length === 0) {
          toast.info('Aucun résultat trouvé');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
      console.error('Erreur recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedVerse(null);
  };

  return (
    <div className="bible-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un mot ou une phrase dans la Bible..."
            className="search-input"
          />
          {query && (
            <button type="button" onClick={clearSearch} className="clear-btn">
              <X className="icon" />
            </button>
          )}
        </div>
        <button type="submit" disabled={isLoading} className="search-btn">
          {isLoading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h3>Résultats ({results.length})</h3>
          </div>
          <div className="results-list">
            {results.map((result, index) => (
              <div
                key={index}
                className="result-item"
                onClick={() => setSelectedVerse(result)}
              >
                <div className="result-reference">
                  {result.bookName} {result.chapter}:{result.verse}
                </div>
                <div className="result-text">
                  {result.text.length > 200
                    ? result.text.substring(0, 200) + '...'
                    : result.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVerse && (
        <div className="verse-detail-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSelectedVerse(null)}>
              <X className="icon" />
            </button>
            <div className="verse-detail">
              <div className="verse-reference">
                {selectedVerse.bookName} {selectedVerse.chapter}:{selectedVerse.verse}
              </div>
              <div className="verse-text">{selectedVerse.text}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleSearch;