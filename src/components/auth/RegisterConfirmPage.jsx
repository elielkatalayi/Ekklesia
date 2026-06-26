import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, Loader2, ArrowLeft, Church, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterConfirmPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer toutes les données
  const phone = sessionStorage.getItem('registerPhone');
  const name = sessionStorage.getItem('registerName');
  const churchId = sessionStorage.getItem('selectedChurchId');
  const churchName = sessionStorage.getItem('selectedChurchName');

  useEffect(() => {
    // Vérifier que toutes les données sont présentes
    if (!phone || !name || !churchId) {
      toast.error('Données manquantes, veuillez recommencer');
      navigate('/register');
    }
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const result = await register(phone, name, churchId);
      
      if (result.success) {
        // Nettoyer les données de session
        sessionStorage.removeItem('registerPhone');
        sessionStorage.removeItem('registerName');
        sessionStorage.removeItem('selectedChurchId');
        sessionStorage.removeItem('selectedChurchName');
        
        toast.success('🎉 Inscription réussie !');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/choose-church');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-brown-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white text-3xl mb-4">
            ✅
          </div>
          <h1 className="text-3xl font-bold text-primary-800">Confirmation</h1>
          <p className="text-gray-600 mt-2">Vérifiez vos informations</p>
        </div>

        {/* Étape 3 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">3</span>
            <span className="text-sm font-medium text-gray-500">/ 3</span>
            <span className="ml-2 text-sm text-gray-400">Confirmation</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">Vérifiez vos informations</h2>
          <p className="text-gray-500 text-sm mb-6">
            Assurez-vous que toutes les informations sont correctes
          </p>

          {/* Résumé des informations */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-400">Nom complet</p>
                <p className="font-medium text-gray-800">{name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-400">Numéro de téléphone</p>
                <p className="font-medium text-gray-800">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Church className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-400">Église</p>
                <p className="font-medium text-gray-800">{churchName}</p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg transition flex items-center justify-center gap-2 px-6 py-2"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Inscription...</>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirmer l'inscription
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmPage;