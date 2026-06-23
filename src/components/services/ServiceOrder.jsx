import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, 
  Music, BookOpen, Search, X, Check, ChevronDown, ChevronUp,
  ChevronRight
} from 'lucide-react';
import serviceOrderApi from '../../api/serviceOrder.api';
import hymnsApi from '../../api/hymns.api';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const ServiceOrder = ({ service, onBack, onUpdate, canManage }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [hymnsDetails, setHymnsDetails] = useState({});
  const [versesDetails, setVersesDetails] = useState({});

  // État pour l'affichage des paroles
  const [expandedHymns, setExpandedHymns] = useState({});

  // État pour la sélection de cantiques
  const [hymnBooks, setHymnBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [hymnsInBook, setHymnsInBook] = useState([]);
  const [selectedHymns, setSelectedHymns] = useState([]);
  const [searchHymnTerm, setSearchHymnTerm] = useState('');
  const [isLoadingHymns, setIsLoadingHymns] = useState(false);
  const [showHymnSelector, setShowHymnSelector] = useState(false);

  const itemTypes = [
    { value: 'song', label: '🎵 Cantique' },
    { value: 'prayer', label: '🙏 Prière' },
    { value: 'scripture', label: '📖 Écriture' },
    { value: 'message', label: '💬 Message' },
    { value: 'announcements', label: '📢 Annonces' },
    { value: 'offering', label: '💰 Offrande' },
    { value: 'other', label: '📌 Autre' },
  ];

  const visibilityOptions = [
    { value: 'everyone', label: 'Tout le monde' },
    { value: 'members_only', label: 'Membres seulement' },
    { value: 'moderator_only', label: 'Modérateurs seulement' },
    { value: 'after_service', label: 'Après le service' },
  ];

  useEffect(() => {
    if (service) {
      loadOrders();
      loadHymnBooks();
    }
  }, [service]);

  useEffect(() => {
    if (orders.length > 0) {
      loadHymnsAndVerses();
    }
  }, [orders]);

  useEffect(() => {
    if (selectedBookId) {
      loadHymnsByBook(selectedBookId);
    } else {
      setHymnsInBook([]);
    }
  }, [selectedBookId]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await serviceOrderApi.getOrdersByService(service.id);
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'ordre');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHymnBooks = async () => {
    try {
      const response = await hymnsApi.getHymnBooks();
      if (response.data.success) {
        setHymnBooks(response.data.data.books || []);
      }
    } catch (error) {
      console.error('Erreur chargement recueils:', error);
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

  const loadHymnsAndVerses = async () => {
    try {
      const allHymnIds = orders
        .filter(o => o.hymnIds && o.hymnIds.length > 0)
        .flatMap(o => o.hymnIds)
        .filter((id, index, self) => self.indexOf(id) === index);

      const allVerseRefs = orders
        .filter(o => o.verseIds && o.verseIds.length > 0)
        .flatMap(o => o.verseIds)
        .filter((ref, index, self) => self.indexOf(ref) === index);

      if (allHymnIds.length > 0) {
        const hymnsResponse = await hymnsApi.getHymnsByIds({ ids: allHymnIds });
        if (hymnsResponse.data.success) {
          const hymnsMap = {};
          hymnsResponse.data.data.hymns.forEach(hymn => {
            hymnsMap[hymn.id] = hymn;
          });
          setHymnsDetails(hymnsMap);
        }
      }

      if (allVerseRefs.length > 0) {
        const versesMap = {};
        for (const ref of allVerseRefs) {
          try {
            const parsed = parseVerseReference(ref);
            if (parsed) {
              const verseResponse = await bibleApi.getVerse('LSG1910', parsed.book, parsed.chapter, parsed.verse);
              if (verseResponse.data.success) {
                versesMap[ref] = verseResponse.data.data.verse;
              }
            }
          } catch (error) {
            console.error(`Erreur chargement verset ${ref}:`, error);
          }
        }
        setVersesDetails(versesMap);
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    }
  };

  const parseVerseReference = (reference) => {
    const match = reference.match(/^([A-Za-z]+)\s+(\d+):(\d+)$/);
    if (!match) return null;
    return {
      book: match[1],
      chapter: parseInt(match[2]),
      verse: parseInt(match[3])
    };
  };

  // Filtrer les cantiques par recherche
  const filteredHymns = hymnsInBook.filter(hymn => {
    if (!searchHymnTerm) return true;
    const term = searchHymnTerm.toLowerCase();
    return (
      hymn.title.toLowerCase().includes(term) ||
      (hymn.number && hymn.number.toString().includes(term))
    );
  });

  // Toggle sélection d'un cantique
  const toggleHymnSelection = (hymn) => {
    const exists = selectedHymns.find(h => h.id === hymn.id);
    if (exists) {
      setSelectedHymns(selectedHymns.filter(h => h.id !== hymn.id));
    } else {
      setSelectedHymns([...selectedHymns, hymn]);
    }
  };

  // Vérifier si un cantique est sélectionné
  const isHymnSelected = (hymnId) => {
    return selectedHymns.some(h => h.id === hymnId);
  };

  // ✅ Toggle affichage des paroles
  const toggleHymnLyrics = (hymnId) => {
    setExpandedHymns(prev => ({
      ...prev,
      [hymnId]: !prev[hymnId]
    }));
  };

  const handleAddOrder = async (data) => {
    setIsLoading(true);
    try {
      const nextOrder = orders.length + 1;
      const hymnIds = selectedHymns.map(h => h.id);
      
      const payload = {
        serviceId: service.id,
        order: nextOrder,
        itemType: data.itemType,
        reference: data.reference || null,
        hymnIds: hymnIds,
        verseIds: data.verseIds || [],
        customText: data.customText || null,
        durationMinutes: data.durationMinutes ? parseInt(data.durationMinutes) : null,
        visibility: data.visibility || 'everyone',
      };
      
      const response = await serviceOrderApi.createOrder(payload);
      
      if (response.data.success) {
        toast.success('Étape ajoutée');
        setShowAddForm(false);
        setSelectedHymns([]);
        setSelectedBookId('');
        setSearchHymnTerm('');
        loadOrders();
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await serviceOrderApi.updateOrder(id, data);
      if (response.data.success) {
        toast.success('Étape mise à jour');
        setEditingOrder(null);
        loadOrders();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette étape ?')) return;
    
    setIsLoading(true);
    try {
      const response = await serviceOrderApi.deleteOrder(id);
      if (response.data.success) {
        toast.success('Étape supprimée');
        loadOrders();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (id, direction) => {
    const currentIndex = orders.findIndex(o => o.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === orders.length - 1)
    ) return;

    const newOrders = [...orders];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const temp = newOrders[currentIndex];
    newOrders[currentIndex] = newOrders[targetIndex];
    newOrders[targetIndex] = temp;

    const orderData = newOrders.map((o, idx) => ({ id: o.id, order: idx + 1 }));
    
    try {
      await serviceOrderApi.reorderOrders({ serviceId: service.id, orders: orderData });
      loadOrders();
    } catch (error) {
      toast.error('Erreur lors du réordonnancement');
    }
  };

  const getItemTypeLabel = (type) => {
    const found = itemTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  const getVisibilityLabel = (visibility) => {
    const found = visibilityOptions.find(v => v.value === visibility);
    return found ? found.label : visibility;
  };

  // ✅ Formater les paroles avec des sauts de ligne
  const formatLyrics = (lyrics) => {
    if (!lyrics) return '';
    return lyrics.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lyrics.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (isLoading) {
    return (
      <div className="service-order-loading">
        <div className="spinner"></div>
        <p>Chargement de l'ordre du service...</p>
      </div>
    );
  }

  return (
    <div className="service-order">
      <div className="order-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft className="icon" /> Retour
        </button>
        <div className="order-title">
          <h2>{service.title || 'Service'}</h2>
          <span className="order-date">{service.date}</span>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="icon" /> Ajouter une étape
          </button>
        )}
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && canManage && (
        <OrderForm
          onSubmit={handleAddOrder}
          onCancel={() => {
            setShowAddForm(false);
            setSelectedHymns([]);
            setSelectedBookId('');
            setSearchHymnTerm('');
          }}
          itemTypes={itemTypes}
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
        />
      )}

      {/* Liste des étapes */}
      <div className="order-list">
        {orders.length === 0 ? (
          <div className="order-empty">
            <p>Aucune étape définie pour ce service</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order.id} className={`order-item ${order.visibility === 'moderator_only' ? 'restricted' : ''}`}>
              {editingOrder === order.id ? (
                <OrderEditForm
                  order={order}
                  onSubmit={handleUpdateOrder}
                  onCancel={() => setEditingOrder(null)}
                  itemTypes={itemTypes}
                  visibilityOptions={visibilityOptions}
                />
              ) : (
                <>
                  <div className="order-number">{index + 1}</div>
                  <div className="order-content">
                    <div className="order-type">{getItemTypeLabel(order.itemType)}</div>
                    
                    {/* ✅ Afficher les cantiques avec leurs paroles */}
                    {order.hymnIds && order.hymnIds.length > 0 && (
                      <div className="order-hymns">
                        <Music className="icon" />
                        {order.hymnIds.map((hymnId, idx) => {
                          const hymn = hymnsDetails[hymnId];
                          if (!hymn) return null;
                          const isExpanded = expandedHymns[hymnId] || false;
                          
                          return (
                            <div key={hymnId} className="hymn-item-wrapper">
                              <div 
                                className="hymn-item-header"
                                onClick={() => toggleHymnLyrics(hymnId)}
                                style={{ cursor: 'pointer' }}
                              >
                                <span className="hymn-item">
                                  {hymn.number ? `n°${hymn.number}` : ''} {hymn.title}
                                  {idx < order.hymnIds.length - 1 && ','}
                                </span>
                                <button 
                                  className="hymn-expand-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleHymnLyrics(hymnId);
                                  }}
                                >
                                  <ChevronRight 
                                    className={`icon ${isExpanded ? 'rotated' : ''}`} 
                                  />
                                </button>
                              </div>
                              
                              {/* ✅ Paroles du cantique */}
                              {isExpanded && hymn.lyrics && (
                                <div className="hymn-lyrics-container">
                                  <div className="hymn-lyrics">
                                    {formatLyrics(hymn.lyrics)}
                                  </div>
                                  {hymn.chorus && (
                                    <div className="hymn-chorus">
                                      <strong>Refrain:</strong><br />
                                      {formatLyrics(hymn.chorus)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ✅ Afficher les versets avec leurs textes */}
                    {order.verseIds && order.verseIds.length > 0 && (
                      <div className="order-verses">
                        <BookOpen className="icon" />
                        {order.verseIds.map((ref, idx) => {
                          const verse = versesDetails[ref];
                          return verse ? (
                            <div key={ref} className="verse-item-wrapper">
                              <span className="verse-item">
                                {verse.bookName} {verse.chapter}:{verse.verse}
                                {idx < order.verseIds.length - 1 && ','}
                              </span>
                              <div className="verse-text-preview">
                                "{verse.text}"
                              </div>
                            </div>
                          ) : (
                            <span key={ref} className="verse-item">
                              {ref}
                              {idx < order.verseIds.length - 1 && ','}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {order.reference && !order.hymnIds?.length && !order.verseIds?.length && (
                      <div className="order-reference">
                        <span className="reference">{order.reference}</span>
                      </div>
                    )}
                    
                    {order.customText && (
                      <div className="order-custom-text">{order.customText}</div>
                    )}
                    
                    {order.durationMinutes && (
                      <span className="order-duration">{order.durationMinutes} min</span>
                    )}
                    
                    <span className="order-visibility">
                      👁️ {getVisibilityLabel(order.visibility)}
                    </span>
                  </div>
                  
                  {canManage && (
                    <div className="order-actions">
                      <button 
                        className="action-btn move-up"
                        onClick={() => handleReorder(order.id, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="icon" />
                      </button>
                      <button 
                        className="action-btn move-down"
                        onClick={() => handleReorder(order.id, 'down')}
                        disabled={index === orders.length - 1}
                      >
                        <MoveDown className="icon" />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => setEditingOrder(order.id)}
                      >
                        <Edit2 className="icon" />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {service.published && (
        <div className="order-published-badge">
          <CheckCircle className="icon" /> Ce service a été publié
        </div>
      )}
    </div>
  );
};

// ============================================
// OrderForm - Formulaire d'ajout
// ============================================
const OrderForm = ({ 
  onSubmit, 
  onCancel, 
  itemTypes, 
  visibilityOptions,
  hymnBooks,
  selectedBookId,
  setSelectedBookId,
  filteredHymns,
  selectedHymns,
  toggleHymnSelection,
  isHymnSelected,
  searchHymnTerm,
  setSearchHymnTerm,
  isLoadingHymns,
  showHymnSelector,
  setShowHymnSelector,
  nextOrder
}) => {
  const [formData, setFormData] = useState({
    itemType: 'song',
    order: nextOrder || 1,
    reference: '',
    customText: '',
    durationMinutes: '',
    visibility: 'everyone',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemType) {
      toast.error('Veuillez sélectionner un type');
      return;
    }
    
    if (formData.itemType === 'song' && selectedHymns.length === 0) {
      toast.error('Veuillez sélectionner au moins un cantique');
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {/* ... le reste du formulaire (inchangé) ... */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Type <span className="required">*</span></label>
          <select
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            className="form-select"
            required
          >
            {itemTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Position <span className="required">*</span></label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="form-input"
            min="1"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Référence <span className="optional">(optionnel)</span></label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Ex: Jean 3:16 ou 45"
            className="form-input"
          />
        </div>
      </div>

      {/* Sélecteur de cantiques */}
      {formData.itemType === 'song' && (
        <div className="form-group hymn-selector-group">
          {/* ... le sélecteur de cantiques (inchangé) ... */}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Texte personnalisé <span className="optional">(optionnel)</span></label>
          <input
            type="text"
            name="customText"
            value={formData.customText}
            onChange={handleChange}
            placeholder="Texte pour l'étape"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Durée (minutes) <span className="optional">(optionnel)</span></label>
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            placeholder="15"
            className="form-input"
            min="1"
          />
        </div>
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

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

// ============================================
// OrderEditForm - Formulaire de modification
// ============================================
const OrderEditForm = ({ order, onSubmit, onCancel, itemTypes, visibilityOptions }) => {
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
      {/* ... le formulaire d'édition (inchangé) ... */}
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

export default ServiceOrder;