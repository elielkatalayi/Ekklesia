import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

// ✅ Liste des indicatifs pays
const COUNTRY_CODES = [
  { code: '+243', country: '🇨🇩 RDC' },
  { code: '+225', country: '🇨🇮 Côte d\'Ivoire' },
  { code: '+221', country: '🇸🇳 Sénégal' },
  { code: '+237', country: '🇨🇲 Cameroun' },
  { code: '+242', country: '🇨🇬 Congo' },
  { code: '+241', country: '🇬🇦 Gabon' },
  { code: '+236', country: '🇨🇫 Centrafrique' },
  { code: '+235', country: '🇹🇩 Tchad' },
  { code: '+234', country: '🇳🇬 Nigeria' },
  { code: '+233', country: '🇬🇭 Ghana' },
  { code: '+229', country: '🇧🇯 Bénin' },
  { code: '+228', country: '🇹🇬 Togo' },
  { code: '+227', country: '🇳🇪 Niger' },
  { code: '+226', country: '🇧🇫 Burkina Faso' },
  { code: '+223', country: '🇲🇱 Mali' },
  { code: '+222', country: '🇲🇷 Mauritanie' },
  { code: '+218', country: '🇱🇾 Libye' },
  { code: '+216', country: '🇹🇳 Tunisie' },
  { code: '+213', country: '🇩🇿 Algérie' },
  { code: '+212', country: '🇲🇦 Maroc' },
  { code: '+33', country: '🇫🇷 France' },
  { code: '+32', country: '🇧🇪 Belgique' },
  { code: '+41', country: '🇨🇭 Suisse' },
  { code: '+44', country: '🇬🇧 Royaume-Uni' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [selectedCode, setSelectedCode] = useState('+243');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formData, setFormData] = useState({
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

    const fullPhone = selectedCode + phoneNumber;

    // Validation du numéro de téléphone
    if (!phoneNumber || phoneNumber.length < 7) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Veuillez entrer votre nom');
      return;
    }

    // ✅ Sauvegarder les données temporairement et passer à l'étape 2
    sessionStorage.setItem('registerPhone', fullPhone);
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
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Numéro de téléphone avec indicatif */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="flex gap-2">
                {/* Sélecteur d'indicatif */}
                <div className="relative w-32">
                  <select
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="w-full pl-3 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none bg-white"
                    disabled={isLoading}
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Numéro de téléphone */}
                <input
                  type="tel"
                  name="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="812345678"
                  className="flex-1 pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {selectedCode}812345678 (exemple)
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !phoneNumber || !formData.name}
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