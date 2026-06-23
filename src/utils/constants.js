// Rôles utilisateur
export const USER_ROLES = {
  MEMBER: 'member',
  DEACON: 'deacon',
  MODERATOR: 'moderator',
  PASTOR: 'pastor',
};

// Statuts des annonces
export const ANNOUNCEMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

// Types d'éléments dans l'ordre du culte
export const SERVICE_ITEM_TYPES = {
  SONG: 'song',
  PRAYER: 'prayer',
  SCRIPTURE: 'scripture',
  MESSAGE: 'message',
  ANNOUNCEMENTS: 'announcements',
  OFFERING: 'offering',
  OTHER: 'other',
};

// Statuts de bruit
export const NOISE_STATUS = {
  SILENCE: 'silence',
  NORMAL: 'normal',
  ELEVATED: 'elevated',
  VERY_HIGH: 'very_high',
  DANGER: 'danger',
};

export const NOISE_STATUS_COLORS = {
  [NOISE_STATUS.SILENCE]: '#94a3b8',
  [NOISE_STATUS.NORMAL]: '#22c55e',
  [NOISE_STATUS.ELEVATED]: '#eab308',
  [NOISE_STATUS.VERY_HIGH]: '#f97316',
  [NOISE_STATUS.DANGER]: '#ef4444',
};

export const NOISE_STATUS_LABELS = {
  [NOISE_STATUS.SILENCE]: '🔇 Silence',
  [NOISE_STATUS.NORMAL]: '🔉 Normal',
  [NOISE_STATUS.ELEVATED]: '🔊 Élevé',
  [NOISE_STATUS.VERY_HIGH]: '📢 Très élevé',
  [NOISE_STATUS.DANGER]: '🚨 Dangereux',
};