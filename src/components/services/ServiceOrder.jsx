// components/services/ServiceOrder.js

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, 
  Music, BookOpen, X, ChevronRight
} from 'lucide-react';
import serviceOrderApi from '../../api/serviceOrder.api';
import hymnsApi from '../../api/hymns.api';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';
import { BIBLE_BOOKS } from './BIBLE_BOOKS';

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

const ServiceOrder = ({ service, onBack, onUpdate, canManage }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [hymnsDetails, setHymnsDetails] = useState({});
  const [versesDetails, setVersesDetails] = useState({});
  const [chapterVerses, setChapterVerses] = useState({});
  const [expandedHymns, setExpandedHymns] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});

  useEffect(() => {
    if (service) {
      loadOrders();
    }
  }, [service]);

  useEffect(() => {
    if (orders.length > 0) {
      loadHymnsAndVerses();
    }
  }, [orders]);

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
        const chaptersMap = {};
        
        for (const ref of allVerseRefs) {
          // ✅ Vérifier si c'est une référence de chapitre (ex: "GEN 2")
          const chapterMatch = ref.match(/^([A-Z0-9]+)\s+(\d+)$/);
          
          if (chapterMatch) {
            // ✅ C'est un chapitre entier
            const bookCode = chapterMatch[1];
            const chapter = parseInt(chapterMatch[2]);
            
            try {
              const response = await bibleApi.getChapter('LSG1910', bookCode, chapter);
              if (response.data.success) {
                const { verses, bookName, totalVerses } = response.data.data.chapter;
                chaptersMap[ref] = {
                  isChapter: true,
                  bookName: bookName,
                  chapter: chapter,
                  totalVerses: totalVerses,
                  verses: verses
                };
              }
            } catch (error) {
              console.error(`Erreur chargement chapitre ${ref}:`, error);
            }
          } else {
            // ✅ C'est un verset simple
            const parsed = parseVerseReference(ref);
            if (parsed) {
              try {
                const verseResponse = await bibleApi.getVerse('LSG1910', parsed.book, parsed.chapter, parsed.verse);
                if (verseResponse.data.success) {
                  versesMap[ref] = verseResponse.data.data.verse;
                }
              } catch (error) {
                console.error(`Erreur chargement verset ${ref}:`, error);
              }
            }
          }
        }
        setVersesDetails(versesMap);
        setChapterVerses(chaptersMap);
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    }
  };

  const parseVerseReference = (reference) => {
    const match = reference.match(/^([A-Z0-9]+)\s+(\d+):(\d+)$/);
    if (!match) {
      console.warn('⚠️ Format de référence non reconnu:', reference);
      return null;
    }
    const bookCode = match[1];
    const book = BIBLE_BOOKS.find(b => b.value === bookCode);
    if (!book) {
      console.warn('⚠️ Code de livre non trouvé:', bookCode);
      return null;
    }
    return {
      book: bookCode,
      chapter: parseInt(match[2]),
      verse: parseInt(match[3])
    };
  };

  const toggleHymnLyrics = (hymnId) => {
    setExpandedHymns(prev => ({
      ...prev,
      [hymnId]: !prev[hymnId]
    }));
  };

  const toggleChapter = (ref) => {
    setExpandedChapters(prev => ({
      ...prev,
      [ref]: !prev[ref]
    }));
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette étape ?')) return;
    setIsLoading(true);
    try {
      const response = await serviceOrderApi.deleteOrder(id);
      if (response.data.success) {
        toast.success('Étape supprimée');
        loadOrders();
        if (onUpdate) onUpdate();
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
      </div>

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="order-empty">
            <p>Aucune étape définie pour ce service</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order.id} className={`order-item ${order.visibility === 'moderator_only' ? 'restricted' : ''}`}>
              <div className="order-number">{index + 1}</div>
              <div className="order-content">
                <div className="order-type">{getItemTypeLabel(order.itemType)}</div>

                {/* Cantiques */}
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
                          {isExpanded && hymn.lyrics && (
                            <div className="hymn-lyrics-container">
                              <div className="hymn-lyrics">{formatLyrics(hymn.lyrics)}</div>
                              {hymn.chorus && (
                                <div className="hymn-chorus">
                                  <strong>Refrain:</strong>
                                  <br />
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

                {/* ✅ Versets - Gestion des chapitres et versets */}
                {order.verseIds && order.verseIds.length > 0 && (
                  <div className="order-verses">
                    <BookOpen className="icon" />
                    {order.verseIds.map((ref, idx) => {
                      const parts = ref.split(' ');
                      const code = parts[0];
                      const book = BIBLE_BOOKS.find(b => b.value === code);
                      const displayName = book ? book.label : code;
                      const rest = parts.slice(1).join(' ');

                      // ✅ Vérifier si c'est un chapitre
                      const chapterData = chapterVerses[ref];
                      
                      if (chapterData && chapterData.isChapter) {
                        // ✅ Affichage d'un chapitre entier
                        const isExpanded = expandedChapters[ref] || false;
                        return (
                          <div key={ref} className="chapter-item-wrapper">
                            <div
                              className="chapter-item-header"
                              onClick={() => toggleChapter(ref)}
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="chapter-item">
                                📖 {displayName} {rest}
                                {idx < order.verseIds.length - 1 && ','}
                                <span className="chapter-count">({chapterData.totalVerses} versets)</span>
                              </span>
                              <button
                                className="chapter-expand-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleChapter(ref);
                                }}
                              >
                                <ChevronRight
                                  className={`icon ${isExpanded ? 'rotated' : ''}`}
                                />
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="chapter-verses-container">
                                <div className="chapter-verses-list">
                                  {chapterData.verses.map((v) => (
                                    <div key={v.verse} className="chapter-verse-item">
                                      <span className="chapter-verse-number">{v.verse}</span>
                                      <span className="chapter-verse-text">{v.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // ✅ Affichage d'un verset simple
                      const verse = versesDetails[ref];
                      return verse ? (
                        <div key={ref} className="verse-item-wrapper">
                          <span className="verse-item">
                            {displayName} {rest}
                            {idx < order.verseIds.length - 1 && ','}
                          </span>
                          <div className="verse-text-preview">"{verse.text}"</div>
                        </div>
                      ) : (
                        <span key={ref} className="verse-item">
                          {displayName} {rest}
                          {idx < order.verseIds.length - 1 && ','}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Référence */}
                {order.reference && !order.hymnIds?.length && !order.verseIds?.length && (
                  <div className="order-reference">
                    <span className="reference">{order.reference}</span>
                  </div>
                )}

                {/* Texte personnalisé */}
                {order.customText && <div className="order-custom-text">{order.customText}</div>}

                {/* Durée */}
                {order.durationMinutes && (
                  <span className="order-duration">{order.durationMinutes} min</span>
                )}

                {/* Visibilité */}
                <span className="order-visibility">👁️ {getVisibilityLabel(order.visibility)}</span>
              </div>

              {/* Actions */}
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

export default ServiceOrder;