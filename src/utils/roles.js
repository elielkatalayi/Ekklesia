// utils/roles.js

export const ROLES = {
  MEMBER: 'member',
  DEACON: 'deacon',
  MODERATOR: 'moderator',
  PASTOR: 'pastor'
};

// ============================================
// FONCTIONS DE BASE
// ============================================

export const hasRole = (user, roles) => {
  if (!user) return false;
  return roles.includes(user.role);
};

// ============================================
// PERMISSIONS DES SERVICES
// ============================================

export const canManageServices = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canCreateServices = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canEditServices = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canDeleteServices = (user) => {
  return hasRole(user, ['moderator', 'pastor']);
};

export const canPublishServices = (user) => {
  return hasRole(user, ['moderator', 'pastor']);
};

export const canManageOrder = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canViewService = (user) => {
  return true; // Tous les membres peuvent voir
};

export const getServicePermissions = (user) => {
  return {
    canView: canViewService(user),
    canCreate: canCreateServices(user),
    canEdit: canEditServices(user),
    canDelete: canDeleteServices(user),
    canPublish: canPublishServices(user),
    canManageOrder: canManageOrder(user),
    canManage: canManageServices(user)
  };
};

// ============================================
// PERMISSIONS DES ANNONCES
// ============================================

export const canManageAnnouncements = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canCreateAnnouncements = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canEditAnnouncements = (user) => {
  return hasRole(user, ['deacon', 'moderator', 'pastor']);
};

export const canDeleteAnnouncements = (user) => {
  return hasRole(user, ['moderator', 'pastor']);
};

export const canViewAnnouncements = (user) => {
  return true; // Tous les membres peuvent voir
};

export const getAnnouncementPermissions = (user) => {
  return {
    canView: canViewAnnouncements(user),
    canCreate: canCreateAnnouncements(user),
    canEdit: canEditAnnouncements(user),
    canDelete: canDeleteAnnouncements(user),
    canManage: canManageAnnouncements(user)
  };
};

// ============================================
// PERMISSIONS GÉNÉRALES
// ============================================

export const isAdmin = (user) => {
  return hasRole(user, ['moderator', 'pastor']);
};

export const isPastor = (user) => {
  return hasRole(user, ['pastor']);
};

export const isModerator = (user) => {
  return hasRole(user, ['moderator']);
};

export const isDeacon = (user) => {
  return hasRole(user, ['deacon']);
};

export const isMember = (user) => {
  return hasRole(user, ['member']);
};