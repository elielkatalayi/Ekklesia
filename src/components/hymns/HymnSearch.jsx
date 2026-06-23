import React, { useState, useEffect } from 'react';
import { Search, X, Music } from 'lucide-react';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';

const HymnSearch = ({ onHymnSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Charger les recherches récentes
    const saved = localStorage.getItem('recentHymnSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);
    try {
      const response = await hymnsApi.getHymns({ search: query, limit: 30 });
      if (response.data.success) {
        setResults(response.data.data.hymns || []);
        
        // Sauvegarder la recherche
        const newSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newSearches);
        localStorage.setItem('recentHymnSearches', JSON.stringify(newSearches));
        
        if (response.data.data.hymns?.length === 0) {
          toast.info('Aucun résultat trouvé');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const handleRecentSearch = (term) => {
    setQuery(term);
    // Simuler une recherche
    const fakeEvent = { preventDefault: () => {} };
    handleSearch(fakeEvent);
  };

  return (
    <div className="hymn-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un cantique (titre, numéro, paroles)..."
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

      {/* Recherches récentes */}
      {recentSearches.length > 0 && !results.length && (
        <div className="recent-searches">
          <h4>Recherches récentes</h4>
          <div className="recent-tags">
            {recentSearches.map((term, index) => (
              <button 
                key={index}
                className="recent-tag"
                onClick={() => handleRecentSearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Résultats */}
      {results.length > 0 && (
        <div className="search-results">
          <h3>{results.length} résultat(s) trouvé(s)</h3>
          <div className="results-grid">
            {results.map((hymn) => (
              <div
                key={hymn.id}
                className="hymn-result-card"
                onClick={() => onHymnSelect(hymn)}
              >
                <div className="result-number">{hymn.number || '?'}</div>
                <div className="result-info">
                  <h4 className="result-title">{hymn.title}</h4>
                  {hymn.hymnBook && (
                    <span className="result-book">{hymn.hymnBook.name}</span>
                  )}
                </div>
                <Music className="result-icon" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aucun résultat */}
      {!isLoading && query && results.length === 0 && (
        <div className="no-results">
          <Music className="icon large" />
          <h3>Aucun cantique trouvé</h3>
          <p>Essayez avec d'autres mots-clés</p>
        </div>
      )}
    </div>
  );
};

export default HymnSearch;