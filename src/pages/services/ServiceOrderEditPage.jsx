// pages/services/ServiceOrderEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canManageOrder } from '../../utils/roles';
import OrderEditForm from '../../components/services/OrderEditForm';
import serviceApi from '../../api/service.api';
import serviceOrderApi from '../../api/serviceOrder.api';
import toast from 'react-hot-toast';

const ServiceOrderEditPage = () => {
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const canManage = canManageOrder(user);

  useEffect(() => {
    loadData();
  }, [id, orderId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [serviceRes, ordersRes] = await Promise.all([
        serviceApi.getServiceById(id),
        serviceOrderApi.getOrdersByService(id)
      ]);

      if (serviceRes.data.success) setService(serviceRes.data.data.service);
      if (ordersRes.data.success) {
        const found = ordersRes.data.data.orders.find(o => o.id === orderId);
        if (found) setOrder(found);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement');
      navigate(`/services/${id}/order`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const response = await serviceOrderApi.updateOrder(orderId, data);
      if (response.data.success) {
        toast.success('Étape mise à jour');
        navigate(`/services/${id}/order`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
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

  if (!canManage) {
    toast.error('Vous n\'avez pas les permissions');
    navigate(`/services/${id}/order`);
    return null;
  }

  if (!order) {
    return (
      <div className="not-found">
        <h2>Étape non trouvée</h2>
        <button onClick={() => navigate(`/services/${id}/order`)}>Retour</button>
      </div>
    );
  }

  return (
    <div className="service-order-edit-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(`/services/${id}/order`)}>
          <ChevronLeft className="icon" /> Retour à l'ordre
        </button>
        <h1>Modifier l'étape</h1>
      </div>

      <div className="form-container">
        <OrderEditForm
          order={order}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/services/${id}/order`)}
        />
      </div>
    </div>
  );
};

export default ServiceOrderEditPage;