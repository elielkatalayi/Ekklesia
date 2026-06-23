import React, { useState } from 'react';
import { Save, X, Calendar, Clock, Loader2 } from 'lucide-react';
import serviceApi from '../../api/service.api';
import toast from 'react-hot-toast';

const ServiceBuilder = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    startTime: '',
    endTime: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date) {
      toast.error('La date est requise');
      return;
    }

    setIsLoading(true);
    try {
      const response = await serviceApi.createService(formData);
      if (response.data.success) {
        toast.success('Service créé avec succès');
        onSuccess();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="service-builder">
      <div className="builder-header">
        <h2>📝 Nouveau service</h2>
        <button className="close-btn" onClick={onCancel}>
          <X className="icon" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="builder-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date <span className="required">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Titre <span className="optional">(optionnel)</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Culte du dimanche"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Heure de début <span className="optional">(optionnel)</span></label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Heure de fin <span className="optional">(optionnel)</span></label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description <span className="optional">(optionnel)</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du service..."
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="icon spin" /> Création...</>
            ) : (
              <><Save className="icon" /> Créer le service</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceBuilder;