// pages/services/ServiceListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canManageServices } from '../../utils/roles';
import ServiceList from '../../components/services/ServiceList';
import serviceApi from '../../api/service.api';
import toast from 'react-hot-toast';

const ServiceListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    limit: 20, 
    total: 0, 
    totalPages: 0 
  });

  const canManage = canManageServices(user);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await serviceApi.getServices({ page, limit: 20 });
      if (response.data.success) {
        setServices(response.data.data.services || []);
        setPagination(response.data.data.pagination || { 
          page: 1, limit: 20, total: 0, totalPages: 0 
        });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    navigate(`/services/${service.id}`);
  };

  const handleServiceUpdate = () => {
    loadServices(pagination.page);
  };

  return (
    <div className="services-page">
      <div className="page-header">
        <h1 className="page-title">⛪ Services</h1>
        {canManage && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/services/new')}
          >
            <Plus className="icon" /> Nouveau service
          </button>
        )}
      </div>

      <div className="filters-bar">
        <span className="services-count">
          {pagination.total} service(s)
        </span>
      </div>

      <ServiceList
        services={services}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={loadServices}
        onServiceSelect={handleServiceSelect}
        onServiceUpdate={handleServiceUpdate}
        canManage={canManage}
      />
    </div>
  );
};

export default ServiceListPage;