// pages/services/ServiceDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Edit2, CheckCircle, Trash2, Copy, 
  Calendar, Clock, EyeOff, ListOrdered, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getServicePermissions } from '../../utils/roles';
import serviceApi from '../../api/service.api';
import toast from 'react-hot-toast';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const permissions = getServicePermissions(user);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    setIsLoading(true);
    try {
      const response = await serviceApi.getServiceById(id);
      if (response.data.success) {
        setService(response.data.data.service);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du service');
      navigate('/services');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Voulez-vous publier ce service ?')) return;
    try {
      const response = await serviceApi.publishService(id);
      if (response.data.success) {
        setService(response.data.data.service);
        toast.success('Service publié');
      }
    } catch (error) {
      toast.error('Erreur lors de la publication');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer ce service ?')) return;
    try {
      const response = await serviceApi.deleteService(id);
      if (response.data.success) {
        toast.success('Service supprimé');
        navigate('/services');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ✅ Rediriger vers la page de gestion de l'ordre
  const handleGoToOrder = () => {
    navigate(`/services/${id}/order`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du service...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="not-found">
        <h2>Service non trouvé</h2>
        <button onClick={() => navigate('/services')}>
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/services')}>
          <ChevronLeft className="icon" /> Retour
        </button>
        
        <div className="detail-title">
          <h2>{service.title || 'Service'}</h2>
          <div className="detail-meta">
            <span className="detail-date">
              <Calendar className="icon" /> {service.date}
            </span>
            {service.startTime && (
              <span className="detail-time">
                <Clock className="icon" /> {service.startTime}
                {service.endTime && ` - ${service.endTime}`}
              </span>
            )}
          </div>
        </div>

        <div className="detail-actions">
          {permissions.canEdit && (
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(`/services/${id}/edit`)}
            >
              <Edit2 className="icon" /> Modifier
            </button>
          )}
          
          {/* ✅ Bouton pour gérer l'ordre */}
          {permissions.canManageOrder && (
            <button 
              className="btn btn-primary"
              onClick={handleGoToOrder}
            >
              <ListOrdered className="icon" /> Gérer l'ordre
            </button>
          )}
          
          {permissions.canPublish && !service.published && (
            <button 
              className="btn btn-success"
              onClick={handlePublish}
            >
              <CheckCircle className="icon" /> Publier
            </button>
          )}
          
          {permissions.canDelete && (
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              <Trash2 className="icon" /> Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="detail-status">
        {service.published ? (
          <span className="status-badge published">
            <CheckCircle className="icon" /> Publié
          </span>
        ) : (
          <span className="status-badge draft">
            <EyeOff className="icon" /> Brouillon
          </span>
        )}
        {service.creator && (
          <span className="created-by">
            Créé par {service.creator.name || 'Anonyme'}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Aperçu
        </button>
        <button 
          className={`tab ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => setActiveTab('order')}
        >
          Ordre du service
        </button>
      </div>

      {/* Content */}
      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="tab-content overview">
            {service.description && (
              <div className="service-description">
                <h3>Description</h3>
                <p>{service.description}</p>
              </div>
            )}
            
            {/* ✅ Lien rapide vers l'ordre */}
            <div className="quick-links">
              <button 
                className="quick-link-btn"
                onClick={handleGoToOrder}
              >
                <ListOrdered className="icon" />
                <span>Voir et gérer l'ordre du service</span>
                <ChevronRight className="icon" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="tab-content order-tab">
            {/* ✅ Rediriger vers la page de gestion de l'ordre */}
            <div className="order-redirect">
              <div className="redirect-content">
                <ListOrdered className="icon large" />
                <h3>Gestion de l'ordre du service</h3>
                <p>Accédez à la page dédiée pour gérer toutes les étapes du service</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleGoToOrder}
                >
                  <ListOrdered className="icon" /> Gérer l'ordre
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailPage;