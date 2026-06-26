import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2, Search, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, churches, isLoading } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [showChurchSelector, setShowChurchSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation du numéro de téléphone
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError('Format invalide. Utilisez +243XXXXXXXXX');
      return;
    }

    const result = await login(phone, churchCode || null);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erreur lors de la connexion');
    }
  };

  const filteredChurches = churches.filter(church =>
    church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.churchCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-brown-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white text-3xl mb-4">
            ⛪
          </div>
          <h1 className="text-3xl font-bold text-primary-800">Église App</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre communauté</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Bienvenue</h2>
          <p className="text-gray-500 text-sm mb-6">
            Entrez votre numéro de téléphone pour vous connecter
          </p>

          <form onSubmit={handleSubmit}>
            {/* Numéro de téléphone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243123456789"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                    error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Format: +243XXXXXXXXX (indicatif pays inclus)
              </p>
            </div>

            {/* Code église (optionnel) */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Code église <span className="text-gray-400">(optionnel)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowChurchSelector(!showChurchSelector)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showChurchSelector ? 'Masquer' : 'Choisir une église'}
                </button>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={churchCode}
                  onChange={(e) => setChurchCode(e.target.value.toUpperCase())}
                  placeholder="Ex: JOIE, GRACE"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Laissez vide pour votre église par défaut
              </p>
            </div>

            {/* Sélecteur d'églises */}
            {showChurchSelector && (
              <div className="mb-4 p-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une église..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                {filteredChurches.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">Aucune église trouvée</p>
                ) : (
                  filteredChurches.map((church) => (
                    <button
                      key={church.id}
                      type="button"
                      onClick={() => {
                        setChurchCode(church.churchCode);
                        setShowChurchSelector(false);
                        toast.info(`Église sélectionnée : ${church.name}`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">{church.name}</span>
                      <span className="text-xs text-gray-400">{church.churchCode}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !phone}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                S'inscrire
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-4">
              En continuant, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;