import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Filter, Calendar, X } from 'lucide-react';
import AnnouncementList from '../components/announcements/AnnouncementList';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import announcementApi from '../api/announcement.api';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filter, setFilter] = useState('all'); // 'all' | 'important' | 'expired'

  // Vérifier si l'utilisateur peut créer/modifier des annonces
  const canManageAnnouncements = ['pastor', 'moderator', 'deacon'].includes(user?.role);

  useEffect(() => {
    loadAnnouncements();
  }, [filter]);

  const loadAnnouncements = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter === 'important') params.isImportant = true;
      if (filter === 'expired') params.includeExpired = true;
      
      const response = await announcementApi.getAnnouncements(params);
      if (response.data.success) {
        setAnnouncements(response.data.data.announcements || []);
        setPagination(response.data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    
    try {
      const response = await announcementApi.deleteAnnouncement(id);
      if (response.data.success) {
        toast.success('Annonce supprimée');
        loadAnnouncements(pagination.page);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
    loadAnnouncements(pagination.page);
  };

  return (
    <div className="announcements-page">
      <div className="page-header">
        <h1 className="page-title">📢 Annonces</h1>
        {canManageAnnouncements && (
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus className="icon" /> Nouvelle annonce
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button
            className={`filter-btn ${filter === 'important' ? 'active' : ''}`}
            onClick={() => setFilter('important')}
          >
            ⭐ Importantes
          </button>
          <button
            className={`filter-btn ${filter === 'expired' ? 'active' : ''}`}
            onClick={() => setFilter('expired')}
          >
            📅 Expirées
          </button>
        </div>
        <span className="announcements-count">
          {pagination.total} annonce(s)
        </span>
      </div>

      {/* Liste des annonces */}
      <AnnouncementList
        announcements={announcements}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={loadAnnouncements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canManage={canManageAnnouncements}
      />

      {/* Formulaire de création/édition */}
      {showForm && (
        <div className="announcement-modal">
          <div className="modal-overlay" onClick={handleFormClose}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={handleFormClose}>
              <X className="icon" />
            </button>
            <AnnouncementForm
              announcement={editingAnnouncement}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;