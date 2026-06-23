import dayjs from 'dayjs';

// Importer le locale français
import 'dayjs/locale/fr';

// Configurer dayjs avec la locale française
dayjs.locale('fr');

// Formater un numéro de téléphone
export const formatPhone = (phone) => {
  if (!phone) return '-';
  // Exemple: +243123456789 → +243 12 34 56 789
  return phone.replace(/(\+\d{3})(\d{2})(\d{2})(\d{2})(\d{3})/, '$1 $2 $3 $4 $5');
};

// Formater une date
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

// Formater une date avec heure
export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD/MM/YYYY à HH:mm');
};

// Formater une heure
export const formatTime = (time) => {
  if (!time) return '-';
  return dayjs(`1970-01-01T${time}`).format('HH:mm');
};

// Tronquer un texte
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Formater les décibels
export const formatDecibels = (db) => {
  if (db === null || db === undefined) return '-';
  return `${db.toFixed(1)} dB`;
};

// Capitaliser la première lettre
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};