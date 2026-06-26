import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Search, CheckCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ChooseChurchPage = () => {
  const navigate = useNavigate();
  const { churches, loadChurches, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [isLoadingChurches, setIsLoadingChurches] = useState(true);

  // Récupérer les données de l'étape 1
  const phone = sessionStorage.getItem('registerPhone');
  const name = sessionStorage.getItem('registerName');

  useEffect(() => {
    // Vérifier si l'utilisateur vient de l'étape 1
    if (!phone || !name) {
      toast.error('Veuillez d\'abord entrer vos informations');
      navigate('/register');
      return;
    }

    const loadData = async () => {
      setIsLoadingChurches(true);
      await loadChurches();
      setIsLoadingChurches(false);
    };
    loadData();
  }, []);

  const filteredChurches = churches.filter(church =>
    church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.churchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.pastorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChurch = (church) => {
    setSelectedChurch(church);
  };

  const handleConfirm = async () => {
    if (!selectedChurch) {
      toast.error('Veuillez sélectionner une église');
      return;
    }

    // ✅ Passer à l'étape 3 avec les données
    sessionStorage.setItem('selectedChurchId', selectedChurch.id);
    sessionStorage.setItem('selectedChurchName', selectedChurch.name);
    navigate('/register-confirm');
  };

  const handleBack = () => {
    navigate('/register');
  };

  if (isLoadingChurches) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-brown-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des églises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-brown-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white text-3xl mb-4">
            ⛪
          </div>
          <h1 className="text-3xl font-bold text-primary-800">Choisissez votre église</h1>
          <p className="text-gray-600 mt-2">Sélectionnez l'église que vous voulez rejoindre</p>
        </div>

        {/* Étape 2 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">2</span>
            <span className="text-sm font-medium text-gray-500">/ 3</span>
            <span className="ml-2 text-sm text-gray-400">Sélection de l'église</span>
          </div>

          {/* Infos utilisateur */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Vous vous inscrivez en tant que :</p>
            <p className="font-medium text-gray-800">{name} - {phone}</p>
          </div>

          {/* Recherche - Sans icône */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une église par nom, code ou pasteur..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              autoFocus
            />
          </div>

          {/* Liste des églises */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-6">
            {filteredChurches.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Aucune église trouvée</p>
              </div>
            ) : (
              filteredChurches.map((church) => (
                <div
                  key={church.id}
                  onClick={() => handleSelectChurch(church)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedChurch?.id === church.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{church.name}</h3>
                      {church.pastorName && (
                        <p className="text-sm text-gray-500">👨‍🏫 {church.pastorName}</p>
                      )}
                      {church.address && (
                        <p className="text-sm text-gray-400">📍 {church.address}</p>
                      )}
                      <span className="inline-block mt-1 text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded">
                        Code: {church.churchCode}
                      </span>
                    </div>
                    {selectedChurch?.id === church.id && (
                      <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedChurch || isLoading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg transition flex items-center justify-center gap-2 px-6 py-2"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Chargement...</>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseChurchPage;
