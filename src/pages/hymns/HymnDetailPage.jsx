import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Play, Download, Edit2, Trash2, Music } from 'lucide-react';
import hymnsApi from '../../api/hymns.api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const HymnDetailPage = () => {
  const { bookId, hymnId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hymn, setHymn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullLyrics, setShowFullLyrics] = useState(false);

  const canManage = ['pastor', 'moderator', 'deacon'].includes(user?.role);

  useEffect(() => {
    loadHymn();
  }, [hymnId]);

  const loadHymn = async () => {
    setIsLoading(true);
    try {
      const response = await hymnsApi.getHymnById(hymnId);
      if (response.data.success) {
        setHymn(response.data.data.hymn);
        // Vérifier si c'est un favori (simulé)
        try {
          const favResponse = await hymnsApi.getFavorites();
          if (favResponse.data.success) {
            const favorites = favResponse.data.data.favorites || [];
            const isFav = favorites.some(f => f.hymn?.id === hymnId);
            setIsFavorite(isFav);
          }
        } catch (error) {
          console.log('Erreur chargement favoris:', error);
        }
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du cantique');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const response = await hymnsApi.toggleFavorite({ hymnId });
      if (response.data.success) {
        setIsFavorite(response.data.data.isFavorite);
        toast.success(response.data.data.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    }
  };

  const deleteHymn = async () => {
    if (!confirm('Voulez-vous vraiment supprimer ce cantique ?')) return;
    
    try {
      const response = await hymnsApi.deleteHymn(hymnId);
      if (response.data.success) {
        toast.success('Cantique supprimé');
        navigate(`/hymns/${bookId}`);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatLyrics = (lyrics) => {
    if (!lyrics) return '';
    return lyrics.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!hymn) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cantique non trouvé</p>
        <button onClick={() => navigate(`/hymns/${bookId}`)} className="mt-4 text-primary-600 hover:underline">
          Retour au recueil
        </button>
      </div>
    );
  }

  return (
    <div className="hymn-detail-page">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/hymns/${bookId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">{hymn.title}</h1>
            <span className="text-sm font-medium text-primary-600">
              #{hymn.number || '?'}
            </span>
          </div>
          {hymn.hymnBook && (
            <p className="text-sm text-gray-500">{hymn.hymnBook.name}</p>
          )}
          {hymn.author && (
            <p className="text-sm text-gray-500">par {hymn.author.name}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={toggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isFavorite
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
          <Play className="h-4 w-4" />
          Écouter
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
          <Download className="h-4 w-4" />
          Télécharger
        </button>
        
        {canManage && (
          <>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
              <Edit2 className="h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={deleteHymn}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </>
        )}
      </div>

      {/* Paroles */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {hymn.chorus && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-primary-600 mb-2">Refrain</h3>
            <div className="p-4 bg-primary-50 rounded-lg italic text-gray-700">
              {formatLyrics(hymn.chorus)}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Paroles</h3>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {formatLyrics(hymn.lyrics)}
          </div>
        </div>

        {hymn.youtubeUrl && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <a
              href={hymn.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Regarder sur YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnDetailPage;