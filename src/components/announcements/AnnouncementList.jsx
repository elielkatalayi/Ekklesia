import React from 'react';
import { Calendar, User, Pin, Edit2, Trash2, ChevronLeft, ChevronRight,Megaphone   } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters';

const AnnouncementList = ({ 
  announcements, 
  isLoading, 
  pagination, 
  onPageChange, 
  onEdit, 
  onDelete, 
  canManage 
}) => {
  if (isLoading) {
    return (
      <div className="announcements-loading">
        <div className="spinner"></div>
        <p>Chargement des annonces...</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="announcements-empty">
        <Megaphone className="icon large" />
        <h3>Aucune annonce</h3>
        <p>Aucune annonce n'a été publiée pour le moment</p>
      </div>
    );
  }

  return (
    <div className="announcements-list">
      {announcements.map((announcement) => (
        <div 
          key={announcement.id} 
          className={`announcement-card ${announcement.isImportant ? 'important' : ''}`}
        >
          {announcement.isImportant && (
            <div className="announcement-badge">
              <Pin className="icon" /> Important
            </div>
          )}
          
          <div className="announcement-header">
            <h3 className="announcement-title">{announcement.title || 'Sans titre'}</h3>
            <div className="announcement-meta">
              <span className="meta-item">
                <User className="icon" />
                {announcement.publisher?.name || 'Anonyme'}
              </span>
              <span className="meta-item">
                <Calendar className="icon" />
                {formatDateTime(announcement.publishedAt)}
              </span>
            </div>
          </div>

          <div className="announcement-body">
            <p className="announcement-content">{announcement.content}</p>
            {announcement.imageUrl && (
              <div className="announcement-image">
                <img src={announcement.imageUrl} alt={announcement.title} />
              </div>
            )}
          </div>

          <div className="announcement-footer">
            {announcement.expiresAt && (
              <span className="expiry-date">
                Expire le {formatDate(announcement.expiresAt)}
              </span>
            )}
            
            {canManage && (
              <div className="announcement-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => onEdit(announcement)}
                >
                  <Edit2 className="icon" />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => onDelete(announcement.id)}
                >
                  <Trash2 className="icon" />
                </button>
              </div>
            )}
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
              ({pagination.total} annonces)
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

export default AnnouncementList;