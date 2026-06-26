// pages/services/ServiceOrderAddPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { canManageOrder } from '../../utils/roles';
import OrderForm from '../../components/services/OrderForm';
import serviceApi from '../../api/service.api';
import serviceOrderApi from '../../api/serviceOrder.api';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';
import { BIBLE_BOOKS } from '../../components/services/BIBLE_BOOKS';

const visibilityOptions = [
  { value: 'everyone', label: 'Tout le monde' },
  { value: 'members_only', label: 'Membres seulement' },
  { value: 'moderator_only', label: 'Modérateurs seulement' },
  { value: 'after_service', label: 'Après le service' },
];

const ServiceOrderAddPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [hymnBooks, setHymnBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [hymnsInBook, setHymnsInBook] = useState([]);
  const [selectedHymns, setSelectedHymns] = useState([]);
  const [searchHymnTerm, setSearchHymnTerm] = useState('');
  const [isLoadingHymns, setIsLoadingHymns] = useState(false);
  const [showHymnSelector, setShowHymnSelector] = useState(false);

  const canManage = canManageOrder(user);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (selectedBookId) {
      loadHymnsByBook(selectedBookId);
    } else {
      setHymnsInBook([]);
    }
  }, [selectedBookId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [serviceRes, ordersRes, booksRes] = await Promise.all([
        serviceApi.getServiceById(id),
        serviceOrderApi.getOrdersByService(id),
        hymnsApi.getHymnBooks()
      ]);

      if (serviceRes.data.success) setService(serviceRes.data.data.service);
      if (ordersRes.data.success) setOrders(ordersRes.data.data.orders || []);
      if (booksRes.data.success) setHymnBooks(booksRes.data.data.books || []);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      navigate(`/services/${id}/order`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHymnsByBook = async (bookId) => {
    setIsLoadingHymns(true);
    try {
      const response = await hymnsApi.getHymns({ bookId, limit: 100 });
      if (response.data.success) {
        setHymnsInBook(response.data.data.hymns || []);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des cantiques');
    } finally {
      setIsLoadingHymns(false);
    }
  };

  const filteredHymns = hymnsInBook.filter(hymn => {
    if (!searchHymnTerm) return true;
    const term = searchHymnTerm.toLowerCase();
    return (
      hymn.title.toLowerCase().includes(term) ||
      (hymn.number && hymn.number.toString().includes(term))
    );
  });

  const toggleHymnSelection = (hymn) => {
    const exists = selectedHymns.find(h => h.id === hymn.id);
    if (exists) {
      setSelectedHymns(selectedHymns.filter(h => h.id !== hymn.id));
    } else {
      setSelectedHymns([...selectedHymns, hymn]);
    }
    setShowHymnSelector(false);
  };

  const isHymnSelected = (hymnId) => {
    return selectedHymns.some(h => h.id === hymnId);
  };

  const handleSubmit = async (data) => {
    try {
      const nextOrder = orders.length + 1;
      const hymnIds = selectedHymns.map(h => h.id);

      const payload = {
        serviceId: id,
        order: nextOrder,
        itemType: 'other', // ✅ Fixé à 'other' pour permettre du texte libre
        visibility: data.visibility || 'everyone',
      };

      if (data.reference && data.reference.trim() !== '') {
        payload.reference = data.reference.trim();
      }
      if (hymnIds && hymnIds.length > 0) {
        payload.hymnIds = hymnIds;
      }
      if (data.verseIds && data.verseIds.length > 0) {
        payload.verseIds = data.verseIds;
      }
      if (data.customText && data.customText.trim() !== '') {
        payload.customText = data.customText.trim();
      }
      if (data.durationMinutes && parseInt(data.durationMinutes) > 0) {
        payload.durationMinutes = parseInt(data.durationMinutes);
      }

      const response = await serviceOrderApi.createOrder(payload);

      if (response.data.success) {
        toast.success('Étape ajoutée avec succès');
        navigate(`/services/${id}/order`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout');
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

  return (
    <div className="service-order-add-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(`/services/${id}/order`)}>
          <ChevronLeft className="icon" /> Retour à l'ordre
        </button>
        <h1>Ajouter une étape</h1>
      </div>

      <div className="form-container">
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/services/${id}/order`)}
          visibilityOptions={visibilityOptions}
          hymnBooks={hymnBooks}
          selectedBookId={selectedBookId}
          setSelectedBookId={setSelectedBookId}
          filteredHymns={filteredHymns}
          selectedHymns={selectedHymns}
          toggleHymnSelection={toggleHymnSelection}
          isHymnSelected={isHymnSelected}
          searchHymnTerm={searchHymnTerm}
          setSearchHymnTerm={setSearchHymnTerm}
          isLoadingHymns={isLoadingHymns}
          showHymnSelector={showHymnSelector}
          setShowHymnSelector={setShowHymnSelector}
          nextOrder={orders.length + 1}
          bibleBooks={BIBLE_BOOKS}
        />
      </div>
    </div>
  );
};

export default ServiceOrderAddPage;