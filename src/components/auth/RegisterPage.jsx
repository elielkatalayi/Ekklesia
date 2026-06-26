import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation du numéro de téléphone
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Format de téléphone invalide. Utilisez +243XXXXXXXXX');
      return;
    }

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Veuillez entrer votre nom');
      return;
    }

    // ✅ Sauvegarder les données temporairement et passer à l'étape 2
    sessionStorage.setItem('registerPhone', formData.phone);
    sessionStorage.setItem('registerName', formData.name.trim());
    
    navigate('/choose-church');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-brown-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white text-3xl mb-4">
            ⛪
          </div>
          <h1 className="text-3xl font-bold text-primary-800">Église App</h1>
          <p className="text-gray-600 mt-2">Rejoignez votre communauté</p>
        </div>

        {/* Étape 1 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold">1</span>
            <span className="text-sm font-medium text-gray-500">/ 3</span>
            <span className="ml-2 text-sm text-gray-400">Informations personnelles</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">Créer un compte</h2>
          <p className="text-gray-500 text-sm mb-6">
            Entrez vos informations pour commencer
          </p>

          <form onSubmit={handleSubmit}>
            {/* Nom */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+243123456789"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Format: +243XXXXXXXXX (indicatif pays inclus)
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !formData.phone || !formData.name}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;