import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ServiceList from '../components/services/ServiceList';
import ServiceOrder from '../components/services/ServiceOrder';
import ServiceBuilder from '../components/services/ServiceBuilder';
import serviceApi from '../api/service.api';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const canManageServices = ['pastor', 'moderator', 'deacon'].includes(user?.role);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await serviceApi.getServices({ page, limit: 20 });
      if (response.data.success) {
        setServices(response.data.data.services || []);
        setPagination(response.data.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowBuilder(false);
  };

  const handleOpenBuilder = () => {
    setSelectedService(null);
    setShowBuilder(true);
  };

  const handleServiceCreated = () => {
    setShowBuilder(false);
    loadServices(pagination.page);
  };

  const handleServiceUpdated = () => {
    loadServices(pagination.page);
  };

  return (
    <div className="services-page">
      <div className="page-header">
        <h1 className="page-title">⛪ Services</h1>
        {canManageServices && (
          <button className="btn btn-primary" onClick={handleOpenBuilder}>
            <Plus className="icon" /> Nouveau service
          </button>
        )}
      </div>

      <div className="filters-bar">
        <span className="services-count">
          {pagination.total} service(s)
        </span>
      </div>

      {showBuilder ? (
        <ServiceBuilder 
          onSuccess={handleServiceCreated}
          onCancel={() => setShowBuilder(false)}
        />
      ) : selectedService ? (
        <ServiceOrder 
          service={selectedService}
          onBack={() => setSelectedService(null)}
          onUpdate={handleServiceUpdated}
          canManage={canManageServices}
        />
      ) : (
        <ServiceList
          services={services}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={loadServices}
          onServiceSelect={handleServiceSelect}
          onServiceUpdate={handleServiceUpdated}
          canManage={canManageServices}
        />
      )}
    </div>
  );
};

export default ServicesPage;