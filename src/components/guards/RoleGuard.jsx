// components/guards/RoleGuard.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  canManageServices, 
  canPublishServices, 
  canDeleteServices,
  canCreateServices,
  canEditServices,
  canManageOrder,
  canManageAnnouncements,  // ✅ AJOUTÉ
  canCreateAnnouncements,   // ✅ AJOUTÉ
  canEditAnnouncements,     // ✅ AJOUTÉ
  canDeleteAnnouncements    // ✅ AJOUTÉ
} from '../../utils/roles';

// ============================================
// GUARDS DES SERVICES
// ============================================

export const ServiceManagerGuard = ({ children, redirectTo = '/services' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canManageServices(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const ServiceCreatorGuard = ({ children, redirectTo = '/services' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canCreateServices(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const ServiceEditorGuard = ({ children, redirectTo = '/services' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canEditServices(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const PublisherGuard = ({ children, redirectTo = '/services' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canPublishServices(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const DeleteGuard = ({ children, redirectTo = '/services' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canDeleteServices(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const OrderManagerGuard = ({ children, redirectTo = '/services' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canManageOrder(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

// ============================================
// GUARDS DES ANNONCES
// ============================================

export const AnnouncementManagerGuard = ({ children, redirectTo = '/announcements' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canManageAnnouncements(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export const AnnouncementCreatorGuard = ({ children, redirectTo = '/announcements' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canCreateAnnouncements(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const AnnouncementEditorGuard = ({ children, redirectTo = '/announcements' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canEditAnnouncements(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export const AnnouncementDeleteGuard = ({ children, redirectTo = '/announcements' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!canDeleteAnnouncements(user)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};