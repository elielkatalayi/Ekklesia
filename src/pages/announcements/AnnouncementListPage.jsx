// pages/announcements/AnnouncementListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Megaphone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canManageAnnouncements } from '../../utils/roles';
import AnnouncementList from '../../components/announcements/AnnouncementList';
import announcementApi from '../../api/announcement.api';
import toast from 'react-hot-toast';

const AnnouncementListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    limit: 20, 
    total: 0, 
    totalPages: 0 
  });
  const [filter, setFilter] = useState('all'); // 'all' | 'important' | 'expired'

  const canManage = canManageAnnouncements(user);

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
        setPagination(response.data.data.pagination || { 
          page: 1, limit: 20, total: 0, totalPages: 0 
        });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementClick = (announcement) => {
    navigate(`/announcements/${announcement.id}`);
  };

  const handleEdit = (announcement) => {
    navigate(`/announcements/${announcement.id}/edit`);
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

  return (
    <div className="announcements-page">
      <div className="page-header">
        <h1 className="page-title">📢 Annonces</h1>
        {canManage && (
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/announcements/new')}
          >
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

      <AnnouncementList
        announcements={announcements}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={loadAnnouncements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canManage={canManage}
        onAnnouncementClick={handleAnnouncementClick}
      />
    </div>
  );
};

export default AnnouncementListPage;