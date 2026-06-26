// pages/services/ServiceBuilderPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { canManageServices } from '../../utils/roles';
import ServiceBuilder from '../../components/services/ServiceBuilder';
import serviceApi from '../../api/service.api';
import toast from 'react-hot-toast';

const ServiceBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier les permissions
  if (!canManageServices(user)) {
    toast.error('Vous n\'avez pas les permissions nécessaires');
    navigate('/services');
    return null;
  }

  useEffect(() => {
    if (isEditing) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    setIsLoading(true);
    try {
      const response = await serviceApi.getServiceById(id);
      if (response.data.success) {
        setService(response.data.data.service);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du service');
      navigate('/services');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ MODIFICATION ICI - Rediriger vers la liste des services
  const handleSuccess = () => {
    // Rediriger vers la liste des services au lieu du détail
    navigate('/services');
  };

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/services/${id}`);
    } else {
      navigate('/services');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <ServiceBuilder
      initialData={service}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isEditing={isEditing}
    />
  );
};

export default ServiceBuilderPage;