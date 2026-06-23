import React, { useState, useEffect } from 'react';
import { List, Plus, X, Music, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';

const HymnPlaylist = ({ onHymnSelect }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    setIsLoading(true);
    try {
      const response = await hymnsApi.getPlaylists();
      if (response.data.success) {
        setPlaylists(response.data.data.playlists || []);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Veuillez entrer un nom');
      return;
    }

    setIsLoading(true);
    try {
      const response = await hymnsApi.createPlaylist({ name: newPlaylistName.trim() });
      if (response.data.success) {
        toast.success('Playlist créée');
        setNewPlaylistName('');
        setShowCreateForm(false);
        loadPlaylists();
      }
    } catch (error) {
      toast.error('Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlaylist = async (id, name) => {
    if (!name.trim()) {
      toast.error('Veuillez entrer un nom');
      return;
    }

    setIsLoading(true);
    try {
      const response = await hymnsApi.updatePlaylist(id, { name: name.trim() });
      if (response.data.success) {
        toast.success('Playlist mise à jour');
        setEditingPlaylist(null);
        loadPlaylists();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlaylist = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette playlist ?')) return;
    
    setIsLoading(true);
    try {
      const response = await hymnsApi.deletePlaylist(id);
      if (response.data.success) {
        toast.success('Playlist supprimée');
        if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
        loadPlaylists();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  if (isLoading) {
    return (
      <div className="hymns-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="hymn-playlists">
      <div className="playlists-header">
        <h2>📋 Mes playlists</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
          <Plus className="icon" /> Nouvelle playlist
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="playlist-form">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Nom de la playlist"
            className="playlist-input"
            autoFocus
          />
          <div className="form-actions">
            <button onClick={() => setShowCreateForm(false)} className="cancel-btn">
              Annuler
            </button>
            <button onClick={createPlaylist} className="save-btn">
              Créer
            </button>
          </div>
        </div>
      )}

      <div className="playlists-grid">
        {playlists.length === 0 ? (
          <div className="empty-playlists">
            <List className="icon large" />
            <h3>Aucune playlist</h3>
            <p>Créez votre première playlist pour organiser vos cantiques</p>
          </div>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`playlist-card ${selectedPlaylist?.id === playlist.id ? 'active' : ''}`}
            >
              <div className="playlist-card-header">
                {editingPlaylist === playlist.id ? (
                  <input
                    type="text"
                    defaultValue={playlist.name}
                    className="playlist-edit-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updatePlaylist(playlist.id, e.target.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingPlaylist(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <h3 onClick={() => selectPlaylist(playlist)}>{playlist.name}</h3>
                )}
                <div className="playlist-actions">
                  {editingPlaylist !== playlist.id && (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => setEditingPlaylist(playlist.id)}
                      >
                        <Edit2 className="icon" />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deletePlaylist(playlist.id)}
                      >
                        <Trash2 className="icon" />
                      </button>
                    </>
                  )}
                  {editingPlaylist === playlist.id && (
                    <button 
                      className="save-btn"
                      onClick={(e) => {
                        const input = e.target.parentElement.previousSibling;
                        updatePlaylist(playlist.id, input.value);
                      }}
                    >
                      💾
                    </button>
                  )}
                </div>
              </div>
              
              {selectedPlaylist?.id === playlist.id && (
                <div className="playlist-hymns">
                  {playlist.hymns && playlist.hymns.length > 0 ? (
                    playlist.hymns.map((item, index) => {
                      const hymn = item.hymn || item.churchHymn;
                      if (!hymn) return null;
                      return (
                        <div
                          key={item.id}
                          className="playlist-hymn-item"
                          onClick={() => onHymnSelect(hymn)}
                        >
                          <span className="item-position">{index + 1}</span>
                          <span className="item-title">{hymn.title}</span>
                          <Music className="item-icon" />
                        </div>
                      );
                    })
                  ) : (
                    <p className="empty-hymns">Aucun cantique dans cette playlist</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HymnPlaylist;