// pages/announcements/AnnouncementBuilderPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { canManageAnnouncements } from '../../utils/roles';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';
import announcementApi from '../../api/announcement.api';
import toast from 'react-hot-toast';

const AnnouncementBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [announcement, setAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier les permissions
  if (!canManageAnnouncements(user)) {
    toast.error('Vous n\'avez pas les permissions nécessaires');
    navigate('/announcements');
    return null;
  }

  useEffect(() => {
    if (isEditing) {
      loadAnnouncement();
    }
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

  const handleSuccess = () => {
    navigate('/announcements');
  };

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/announcements/${id}`);
    } else {
      navigate('/announcements');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="announcement-builder-page">
      <div className="builder-header">
        <h2>{isEditing ? '✏️ Modifier l\'annonce' : '📝 Nouvelle annonce'}</h2>
      </div>
      <AnnouncementForm
        announcement={announcement}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AnnouncementBuilderPage;