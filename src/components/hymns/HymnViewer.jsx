import React, { useState } from 'react';
import { X, Heart, Play, Download, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import hymnsApi from '../../api/hymns.api';

const HymnViewer = ({ hymn, onClose, onUpdate }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      const response = await hymnsApi.toggleFavorite({ hymnId: hymn.id });
      if (response.data.success) {
        setIsFavorite(response.data.data.isFavorite);
        toast.success(response.data.data.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHymn = async () => {
    if (!confirm('Voulez-vous vraiment supprimer ce cantique ?')) return;
    
    setIsLoading(true);
    try {
      const response = await hymnsApi.deleteHymn(hymn.id);
      if (response.data.success) {
        toast.success('Cantique supprimé');
        onUpdate();
        onClose();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Formater les paroles (séparer les couplets par \n)
  const formatLyrics = (lyrics) => {
    if (!lyrics) return '';
    return lyrics.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="hymn-viewer">
      <div className="viewer-header">
        <button className="close-btn" onClick={onClose}>
          <X className="icon" />
        </button>
        <div className="viewer-actions">
          <button onClick={toggleFavorite} className="action-btn" disabled={isLoading}>
            <Heart className={`icon ${isFavorite ? 'filled' : ''}`} />
            <span>{isFavorite ? 'Favori' : 'Ajouter aux favoris'}</span>
          </button>
          <button className="action-btn">
            <Play className="icon" />
            <span>Écouter</span>
          </button>
          <button className="action-btn">
            <Download className="icon" />
            <span>Télécharger</span>
          </button>
          <button className="action-btn">
            <Edit2 className="icon" />
            <span>Modifier</span>
          </button>
          <button className="action-btn danger" onClick={deleteHymn}>
            <Trash2 className="icon" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      <div className="viewer-body">
        <div className="hymn-header">
          <div className="hymn-number-large">
            {hymn.number || '?'}
          </div>
          <div className="hymn-title-section">
            <h1 className="hymn-title-large">{hymn.title}</h1>
            {hymn.hymnBook && (
              <span className="hymn-book-badge">{hymn.hymnBook.name}</span>
            )}
            {hymn.author && (
              <p className="hymn-author-text">par {hymn.author.name}</p>
            )}
          </div>
        </div>

        <div className="hymn-lyrics">
          {hymn.chorus && (
            <div className="hymn-chorus-section">
              <h3>Refrain</h3>
              <div className="chorus-text">{formatLyrics(hymn.chorus)}</div>
            </div>
          )}
          
          <div className="hymn-verses-section">
            {hymn.lyrics && (
              <div className="verses-text">{formatLyrics(hymn.lyrics)}</div>
            )}
          </div>
        </div>

        {hymn.youtubeUrl && (
          <div className="hymn-media">
            <h3>Vidéo</h3>
            <a href={hymn.youtubeUrl} target="_blank" rel="noopener noreferrer" className="media-link">
              Regarder sur YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnViewer;