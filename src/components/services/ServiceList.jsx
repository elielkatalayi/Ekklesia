import React from 'react';
import { Calendar, Clock, Eye, Edit2, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters';
import serviceApi from '../../api/service.api';
import toast from 'react-hot-toast';

const ServiceList = ({ 
  services, 
  isLoading, 
  pagination, 
  onPageChange, 
  onServiceSelect,
  onServiceUpdate,
  canManage 
}) => {
  const handlePublish = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await serviceApi.publishService(id);
      if (response.data.success) {
        toast.success('Service publié');
        onServiceUpdate();
      }
    } catch (error) {
      toast.error('Erreur lors de la publication');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Voulez-vous vraiment supprimer ce service ?')) return;
    
    try {
      const response = await serviceApi.deleteService(id);
      if (response.data.success) {
        toast.success('Service supprimé');
        onServiceUpdate();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="services-loading">
        <div className="spinner"></div>
        <p>Chargement des services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="services-empty">
        <Calendar className="icon large" />
        <h3>Aucun service</h3>
        <p>Aucun service n'a été planifié pour le moment</p>
      </div>
    );
  }

  return (
    <div className="services-list">
      {services.map((service) => (
        <div
          key={service.id}
          className={`service-card ${service.published ? 'published' : 'draft'}`}
          onClick={() => onServiceSelect(service)}
        >
          <div className="service-card-header">
            <div className="service-status">
              {service.published ? (
                <span className="status-badge published">
                  <CheckCircle className="icon" /> Publié
                </span>
              ) : (
                <span className="status-badge draft">
                  <XCircle className="icon" /> Brouillon
                </span>
              )}
            </div>
            <div className="service-actions">
              {canManage && !service.published && (
                <button 
                  className="action-btn publish"
                  onClick={(e) => handlePublish(service.id, e)}
                  title="Publier"
                >
                  <CheckCircle className="icon" />
                </button>
              )}
              {canManage && (
                <button 
                  className="action-btn delete"
                  onClick={(e) => handleDelete(service.id, e)}
                  title="Supprimer"
                >
                  <Trash2 className="icon" />
                </button>
              )}
            </div>
          </div>

          <div className="service-card-body">
            <h3 className="service-title">{service.title || 'Service'}</h3>
            <div className="service-meta">
              <span className="meta-item">
                <Calendar className="icon" />
                {formatDate(service.date)}
              </span>
              {service.startTime && (
                <span className="meta-item">
                  <Clock className="icon" />
                  {formatTime(service.startTime)}
                  {service.endTime && ` - ${formatTime(service.endTime)}`}
                </span>
              )}
            </div>
            {service.description && (
              <p className="service-description">{service.description}</p>
            )}
          </div>

          <div className="service-card-footer">
            <span className="created-by">
              Créé par {service.creator?.name || 'Anonyme'}
            </span>
            <button className="view-btn">
              Voir le détail →
            </button>
          </div>
        </div>
      ))}

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
              ({pagination.total} services)
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

export default ServiceList;