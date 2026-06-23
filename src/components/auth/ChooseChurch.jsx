import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authApi from '../../api/auth.api';
import toast from 'react-hot-toast';

const ChooseChurch = () => {
  const navigate = useNavigate();
  const { otpData, chooseChurch } = useAuth();
  const [churches, setChurches] = useState([]);
  const [selectedChurchId, setSelectedChurchId] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!otpData?.phone) {
      navigate('/login');
    }
  }, [otpData, navigate]);

  useEffect(() => {
    const loadChurches = async () => {
      try {
        const response = await authApi.getChurches();
        if (response.data.success) {
          setChurches(response.data.data.churches || []);
        }
      } catch (error) {
        console.error('Erreur chargement églises:', error);
        setError('Impossible de charger les églises');
      }
    };
    loadChurches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedChurchId) {
      setError('Veuillez sélectionner une église');
      return;
    }

    if (!name || name.trim().length < 2) {
      setError('Veuillez entrer votre nom');
      return;
    }

    setIsLoading(true);
    try {
      const result = await chooseChurch(selectedChurchId, name.trim());
      
      if (result.success) {
        // ✅ Rediriger vers dashboard après connexion réussie
        toast.success('Bienvenue dans votre église !');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur lors du choix');
        toast.error(result.error || 'Erreur lors du choix');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du choix';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br" style={{ padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '672px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛪</div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#8B4513' }}>Choisissez votre église</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Rejoignez votre communauté de foi</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Votre nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="input"
                disabled={isLoading}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                Sélectionnez votre église
              </label>
              
              {churches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '8px' }}>🏛️</div>
                  <p style={{ color: '#6b7280' }}>Aucune église disponible</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                  {churches.map((church) => (
                    <div
                      key={church.id}
                      onClick={() => setSelectedChurchId(church.id)}
                      style={{
                        padding: '16px',
                        border: `2px solid ${selectedChurchId === church.id ? '#8B4513' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: selectedChurchId === church.id ? '#f5f0eb' : 'white',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>🏛️</span>
                            <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{church.name}</h3>
                          </div>
                          {church.pastorName && (
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                              Pasteur: {church.pastorName}
                            </p>
                          )}
                          {church.address && (
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                              {church.address}
                            </p>
                          )}
                        </div>
                        {selectedChurchId === church.id && (
                          <span style={{ color: '#8B4513', fontSize: '20px' }}>✅</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p style={{ fontSize: '14px', color: '#dc2626', marginBottom: '16px' }}>{error}</p>}

            <button
              type="submit"
              disabled={isLoading || !selectedChurchId || !name.trim()}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isLoading ? 'Rejoindre...' : 'Rejoindre cette église ✅'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                marginTop: '12px',
                width: '100%',
                fontSize: '14px',
                color: '#9ca3af',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Changer de numéro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChooseChurch;