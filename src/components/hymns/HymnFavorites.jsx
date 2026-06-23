import React, { useState, useEffect } from 'react';
import { Heart, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';

const HymnFavorites = ({ onHymnSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await hymnsApi.getFavorites({ page, limit: 20 });
      if (response.data.success) {
        const items = response.data.data.favorites || [];
        setFavorites(items.map(f => f.hymn || f.churchHymn).filter(Boolean));
        setPagination(response.data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (hymnId, e) => {
    e.stopPropagation();
    try {
      const response = await hymnsApi.toggleFavorite({ hymnId });
      if (response.data.success) {
        setFavorites(favorites.filter(h => h.id !== hymnId));
        toast.success('Retiré des favoris');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    }
  };

  if (isLoading) {
    return (
      <div className="hymns-loading">
        <div className="spinner"></div>
        <p>Chargement des favoris...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="hymns-empty">
        <Heart className="icon large" />
        <h3>Aucun favori</h3>
        <p>Ajoutez vos cantiques préférés en cliquant sur le cœur ❤️</p>
      </div>
    );
  }

  return (
    <div className="hymn-favorites">
      <div className="favorites-header">
        <h2>❤️ Mes favoris</h2>
        <span className="favorites-count">{favorites.length} cantiques</span>
      </div>

      <div className="favorites-grid">
        {favorites.map((hymn) => (
          <div
            key={hymn.id}
            className="hymn-favorite-card"
            onClick={() => onHymnSelect(hymn)}
          >
            <div className="favorite-number">{hymn.number || '?'}</div>
            <div className="favorite-info">
              <h4 className="favorite-title">{hymn.title}</h4>
              {hymn.hymnBook && (
                <span className="favorite-book">{hymn.hymnBook.name}</span>
              )}
            </div>
            <button 
              className="remove-favorite"
              onClick={(e) => removeFavorite(hymn.id, e)}
            >
              <Heart className="icon filled" />
            </button>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => loadFavorites(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            <ChevronLeft className="icon" />
          </button>
          <span className="pagination-info">
            Page {pagination.page} sur {pagination.totalPages}
          </span>
          <button
            onClick={() => loadFavorites(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="pagination-btn"
          >
            <ChevronRight className="icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HymnFavorites;