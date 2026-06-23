import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import churchApi from '../../api/church.api';
import toast from 'react-hot-toast';

const ChurchSettings = ({ church, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: church.name || '',
    address: church.address || '',
    phone: church.phone || '',
    contactEmail: church.contactEmail || '',
    description: church.description || '',
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
      const response = await churchApi.updateChurch(church.id, formData);
      if (response.data.success) {
        onUpdate(response.data.data.church);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="church-settings">
      <h2>⚙️ Paramètres de l'église</h2>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label className="form-label">Nom de l'église</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            placeholder="Adresse de l'église"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+243XXXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email de contact</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="form-input"
              placeholder="contact@eglise.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            placeholder="Description de votre église"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="icon spin" /> Enregistrement...</>
            ) : (
              <><Save className="icon" /> Enregistrer les modifications</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChurchSettings;