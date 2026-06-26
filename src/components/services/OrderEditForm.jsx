// components/services/OrderEditForm.jsx

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const visibilityOptions = [
  { value: 'everyone', label: 'Tout le monde' },
  { value: 'members_only', label: 'Membres seulement' },
  { value: 'moderator_only', label: 'Modérateurs seulement' },
  { value: 'after_service', label: 'Après le service' },
];

const OrderEditForm = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    reference: order.reference || '',
    customText: order.customText || '',
    durationMinutes: order.durationMinutes || '',
    visibility: order.visibility || 'everyone',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(order.id, formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-edit-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Référence</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Texte personnalisé</label>
          <input
            type="text"
            name="customText"
            value={formData.customText}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Durée (minutes)</label>
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="form-input"
            min="1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Visibilité</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="form-select"
          >
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </div>
    </form>
  );
};

export default OrderEditForm;