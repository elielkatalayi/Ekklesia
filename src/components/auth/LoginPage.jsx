import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { sendOtp, isLoading } = useAuth();
  
  const [phone, setPhone] = useState('');
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

    const result = await sendOtp(phone);
    
    if (result.success) {
      navigate('/verify-otp');
    } else {
      setError(result.error || 'Erreur lors de l\'envoi du code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-brown-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white text-3xl mb-4">
            ⛪
          </div>
          <h1 className="text-3xl font-heading text-primary-800">Église App</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre communauté</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Bienvenue</h2>
          <p className="text-gray-500 text-sm mb-6">
            Entrez votre numéro de téléphone pour recevoir un code de vérification
          </p>

          <form onSubmit={handleSubmit}>
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
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Format: +243XXXXXXXXX (indicatif pays inclus)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !phone}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Recevoir le code
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              En continuant, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;