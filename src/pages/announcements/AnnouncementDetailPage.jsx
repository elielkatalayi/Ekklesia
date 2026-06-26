// pages/announcements/AnnouncementDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Edit2, Trash2, Calendar, User, Pin, 
  Megaphone, Clock 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canManageAnnouncements } from '../../utils/roles';
import announcementApi from '../../api/announcement.api';
import { formatDateTime, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const canManage = canManageAnnouncements(user);

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const loadAnnouncement = async () => {
    setIsLoading(true);
    try {
      const response = await announcementApi.getAnnouncementById(id);
      if (response.data.success) {
        setAnnouncement(response.data.data.announcement);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'annonce');
      navigate('/announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    
    try {
      const response = await announcementApi.deleteAnnouncement(id);
      if (response.data.success) {
        toast.success('Annonce supprimée');
        navigate('/announcements');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de l'annonce...</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="not-found">
        <h2>Annonce non trouvée</h2>
        <button onClick={() => navigate('/announcements')}>
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="announcement-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/announcements')}>
          <ChevronLeft className="icon" /> Retour
        </button>
        
        <div className="detail-title">
          <h2>{announcement.title || 'Sans titre'}</h2>
          {announcement.isImportant && (
            <span className="badge important">
              <Pin className="icon" /> Important
            </span>
          )}
        </div>

        {canManage && (
          <div className="detail-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(`/announcements/${id}/edit`)}
            >
              <Edit2 className="icon" /> Modifier
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              <Trash2 className="icon" /> Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="detail-meta">
        <span className="meta-item">
          <User className="icon" />
          Publié par {announcement.publisher?.name || 'Anonyme'}
        </span>
        <span className="meta-item">
          <Calendar className="icon" />
          {formatDateTime(announcement.publishedAt)}
        </span>
        {announcement.expiresAt && (
          <span className="meta-item">
            <Clock className="icon" />
            Expire le {formatDate(announcement.expiresAt)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="detail-content">
        <div className="announcement-body">
          <p className="announcement-text">{announcement.content}</p>
          {announcement.imageUrl && (
            <div className="announcement-image-full">
              <img src={announcement.imageUrl} alt={announcement.title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;