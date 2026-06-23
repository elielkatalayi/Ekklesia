import React, { useState, useEffect } from 'react';
import { Music, Plus, Search, Book, Heart, List, Filter } from 'lucide-react';
import HymnList from '../components/hymns/HymnList';
import HymnViewer from '../components/hymns/HymnViewer';
import HymnSearch from '../components/hymns/HymnSearch';
import HymnFavorites from '../components/hymns/HymnFavorites';
import HymnPlaylist from '../components/hymns/HymnPlaylist';
import hymnsApi from '../api/hymns.api';
import toast from 'react-hot-toast';

const HymnsPage = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'search' | 'favorites' | 'playlists'
  const [selectedHymn, setSelectedHymn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hymns, setHymns] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    loadHymnBooks();
    loadHymns();
  }, []);

  const loadHymnBooks = async () => {
    try {
      const response = await hymnsApi.getHymnBooks();
      if (response.data.success) {
        setBooks(response.data.data.books || []);
      }
    } catch (error) {
      console.error('Erreur chargement recueils:', error);
    }
  };

  const loadHymns = async (page = 1, bookId = null) => {
    setIsLoading(true);
    try {
      const params = { page, limit: 20 };
      if (bookId) params.bookId = bookId;
      
      const response = await hymnsApi.getHymns(params);
      if (response.data.success) {
        setHymns(response.data.data.hymns || []);
        setPagination(response.data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des cantiques');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookFilter = (bookId) => {
    setSelectedBookId(bookId);
    loadHymns(1, bookId);
  };

  const handleHymnSelect = (hymn) => {
    setSelectedHymn(hymn);
  };

  const handleCloseViewer = () => {
    setSelectedHymn(null);
  };

  const handlePageChange = (newPage) => {
    loadHymns(newPage, selectedBookId);
  };

  const handleHymnUpdate = () => {
    loadHymns(pagination.page, selectedBookId);
  };

  return (
    <div className="hymns-page">
      <div className="page-header">
        <h1 className="page-title">🎵 Cantiques</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/hymns/create'}
          >
            <Plus className="icon" /> Ajouter un cantique
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <select
          value={selectedBookId || ''}
          onChange={(e) => handleBookFilter(e.target.value || null)}
          className="filter-select"
        >
          <option value="">Tous les recueils</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>
        
        <div className="filter-actions">
          <button 
            className={`filter-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <Book className="icon" /> Liste
          </button>
          <button 
            className={`filter-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search className="icon" /> Recherche
          </button>
          <button 
            className={`filter-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart className="icon" /> Favoris
          </button>
          <button 
            className={`filter-btn ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            <List className="icon" /> Playlists
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="hymns-content">
        {selectedHymn ? (
          <HymnViewer 
            hymn={selectedHymn} 
            onClose={handleCloseViewer}
            onUpdate={handleHymnUpdate}
          />
        ) : (
          <>
            {activeTab === 'list' && (
              <HymnList
                hymns={hymns}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onHymnSelect={handleHymnSelect}
              />
            )}
            
            {activeTab === 'search' && (
              <HymnSearch onHymnSelect={handleHymnSelect} />
            )}
            
            {activeTab === 'favorites' && (
              <HymnFavorites onHymnSelect={handleHymnSelect} />
            )}
            
            {activeTab === 'playlists' && (
              <HymnPlaylist onHymnSelect={handleHymnSelect} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HymnsPage;