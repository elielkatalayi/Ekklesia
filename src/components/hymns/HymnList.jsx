import React from 'react';
import { Heart, Play, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import hymnsApi from '../../api/hymns.api';

const HymnList = ({ hymns, isLoading, pagination, onPageChange, onHymnSelect }) => {
  const [favorites, setFavorites] = React.useState([]);

  const toggleFavorite = async (hymnId, e) => {
    e.stopPropagation();
    try {
      const response = await hymnsApi.toggleFavorite({ hymnId });
      if (response.data.success) {
        const isFavorite = response.data.data.isFavorite;
        if (isFavorite) {
          setFavorites([...favorites, hymnId]);
          toast.success('Ajouté aux favoris');
        } else {
          setFavorites(favorites.filter(id => id !== hymnId));
          toast.success('Retiré des favoris');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    }
  };

  if (isLoading) {
    return (
      <div className="hymns-loading">
        <div className="spinner"></div>
        <p>Chargement des cantiques...</p>
      </div>
    );
  }

  if (hymns.length === 0) {
    return (
      <div className="hymns-empty">
        <Music className="icon large" />
        <h3>Aucun cantique trouvé</h3>
        <p>Essayez de modifier vos filtres ou d'ajouter un cantique</p>
      </div>
    );
  }

  return (
    <div className="hymns-list-container">
      <div className="hymns-grid">
        {hymns.map((hymn) => (
          <div
            key={hymn.id}
            className="hymn-card"
            onClick={() => onHymnSelect(hymn)}
          >
            <div className="hymn-card-header">
              <div className="hymn-number">
                <span className="number">{hymn.number || '?'}</span>
              </div>
              <div className="hymn-card-actions">
                <button 
                  className="favorite-btn"
                  onClick={(e) => toggleFavorite(hymn.id, e)}
                >
                  <Heart 
                    className={`icon ${favorites.includes(hymn.id) ? 'filled' : ''}`} 
                  />
                </button>
                <button className="play-btn">
                  <Play className="icon" />
                </button>
              </div>
            </div>
            
            <div className="hymn-card-body">
              <h3 className="hymn-title">{hymn.title}</h3>
              {hymn.hymnBook && (
                <span className="hymn-book">{hymn.hymnBook.name}</span>
              )}
              {hymn.author && (
                <span className="hymn-author">par {hymn.author.name}</span>
              )}
            </div>

            <div className="hymn-card-footer">
              {hymn.chorus && (
                <div className="hymn-chorus-preview">
                  "{hymn.chorus.substring(0, 60)}..."
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            <ChevronLeft className="icon" />
          </button>
          
          <span className="pagination-info">
            Page {pagination.page} sur {pagination.totalPages}
            <span className="pagination-total">
              ({pagination.total} cantiques)
            </span>
          </span>
          
          <button
            onClick={() => onPageChange(pagination.page + 1)}
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

export default HymnList;