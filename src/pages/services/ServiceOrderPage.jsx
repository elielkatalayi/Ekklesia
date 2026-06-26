// pages/services/ServiceOrderPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canManageOrder } from '../../utils/roles';
import ServiceOrder from '../../components/services/ServiceOrder';
import serviceApi from '../../api/service.api';
import toast from 'react-hot-toast';

const ServiceOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const canManage = canManageOrder(user);

  useEffect(() => {
    loadService();
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="not-found">
        <h2>Service non trouvé</h2>
        <button onClick={() => navigate('/services')}>Retour</button>
      </div>
    );
  }

  return (
    <div className="service-order-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(`/services/${id}`)}>
          <ChevronLeft className="icon" /> Retour au service
        </button>
        <h1>Ordre du service</h1>
        {canManage && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/services/${id}/order/new`)}
          >
            <Plus className="icon" /> Ajouter une étape
          </button>
        )}
      </div>

      <ServiceOrder 
        service={service}
        onBack={() => navigate(`/services/${id}`)}
        onUpdate={loadService}
        canManage={canManage}
      />
    </div>
  );
};

export default ServiceOrderPage;