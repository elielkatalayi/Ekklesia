import React, { useState, useEffect } from 'react';
import { Save, X, Image, Loader2 } from 'lucide-react';
import announcementApi from '../../api/announcement.api';
import toast from 'react-hot-toast';

const AnnouncementForm = ({ announcement, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    expiresAt: '',
    isImportant: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : '',
        isImportant: announcement.isImportant || false,
      });
      if (announcement.imageUrl) {
        setImagePreview(announcement.imageUrl);
      }
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 10MB');
        return;
      }
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content) {
      toast.error('Le contenu est requis');
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Formater la date correctement
      let expiresAt = null;
      if (formData.expiresAt) {
        // Convertir "2026-06-21" en "2026-06-21T23:59:59.000Z"
        const dateObj = new Date(formData.expiresAt + 'T23:59:59.000Z');
        expiresAt = dateObj.toISOString();
        console.log('📅 [FORM] Date formatée:', expiresAt);
      }
      
      const data = {
        title: formData.title || null,
        content: formData.content,
        expiresAt: expiresAt,  // ✅ Date formatée ou null
        isImportant: formData.isImportant,
      };
      
      console.log('📤 [FORM] Données envoyées:', JSON.stringify(data, null, 2));
      
      let response;
      if (announcement) {
        response = await announcementApi.updateAnnouncement(announcement.id, data);
      } else {
        response = await announcementApi.createAnnouncement(data);
      }

      console.log('✅ [FORM] Réponse reçue:', response.data);

      if (response.data.success) {
        const newAnnouncement = response.data.data.announcement;
        
        // Upload image if present
        if (image) {
          console.log('📤 [FORM] Upload de l\'image...');
          await announcementApi.uploadImage(newAnnouncement.id, image);
        }
        
        toast.success(announcement ? 'Annonce mise à jour' : 'Annonce créée');
        onSuccess();
      }
    } catch (error) {
      console.error('❌ [FORM] Erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const message = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="announcement-form">
      <h2>{announcement ? '✏️ Modifier l\'annonce' : '📝 Nouvelle annonce'}</h2>

      <div className="form-group">
        <label className="form-label">Titre <span className="optional">(optionnel)</span></label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titre de l'annonce"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Contenu <span className="required">*</span></label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Écrivez le contenu de votre annonce..."
          className="form-textarea"
          rows="6"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date d'expiration <span className="optional">(optionnel)</span></label>
          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help">Laissez vide pour ne pas expirer</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="form-label">Options</label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isImportant"
              checked={formData.isImportant}
              onChange={handleChange}
            />
            <span>⭐ Marquer comme importante</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Image <span className="optional">(optionnel)</span></label>
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
            id="image-input"
          />
          <label htmlFor="image-input" className="file-label">
            <Image className="icon" />
            <span>Choisir une image</span>
          </label>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Aperçu" />
              <button
                type="button"
                className="remove-image"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                <X className="icon" />
              </button>
            </div>
          )}
        </div>
        <p className="form-help">Formats acceptés: JPG, PNG, WEBP (max 10MB)</p>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="icon spin" /> Enregistrement...</>
          ) : (
            <><Save className="icon" /> {announcement ? 'Mettre à jour' : 'Publier'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;