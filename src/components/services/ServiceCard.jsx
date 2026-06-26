// src/components/services/ServiceCard.jsx
import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters';

const ServiceCard = ({ 
  service, 
  onClick, 
  onEdit, 
  onPublish, 
  onDelete,
  canManage 
}) => {
  const getStatusBadge = () => {
    if (service.published) {
      return <span className="status-badge published">✅ Publié</span>;
    }
    return <span className="status-badge draft">📝 Brouillon</span>;
  };

  return (
    <div
      onClick={() => onClick(service)}
      className={`service-card ${service.published ? 'published' : 'draft'} cursor-pointer`}
    >
      <div className="service-card-header">
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <span className="text-sm text-gray-500">
            {formatDate(service.date)}
          </span>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            {!service.published && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPublish?.(service);
                }}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Publier
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(service);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(service);
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className="service-card-body">
        <h3 className="service-title">{service.title || 'Service sans titre'}</h3>
        <div className="service-meta">
          <span className="meta-item">
            <Calendar className="icon" />
            {formatDate(service.date)}
          </span>
          {service.startTime && (
            <span className="meta-item">
              ⏰ {formatTime(service.startTime)}
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
  );
};

export default ServiceCard;