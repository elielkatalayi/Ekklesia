import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authApi from '../../api/auth.api';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const navigate = useNavigate();
  const { otpData, verifyOtp } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!otpData?.otpId) {
      navigate('/login');
    }
  }, [otpData, navigate]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtp(fullCode);
      
      console.log('📥 Résultat verifyOtp:', result);
      
      if (result.success) {
        if (result.isComplete) {
          toast.success('Connexion réussie !');
          navigate('/dashboard');
          return;
        }
        
        if (result.needsChurchSelection) {
          toast.success('Veuillez choisir votre église');  // ✅ Changé
          navigate('/choose-church');
          return;
        }
        
        toast.success('Vérification réussie !');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur lors de la vérification');
        toast.error(result.error || 'Erreur lors de la vérification');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Code invalide';
      setError(message);
      toast.error(message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setTimer(300);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    try {
      await authApi.resendOtp(otpData.phone);
      toast.success('Code renvoyé !');
    } catch (error) {
      toast.error('Erreur lors du renvoi');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!otpData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br" style={{ padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '448px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#8B4513' }}>Vérification</h1>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Entrez le code</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
            Un code a été envoyé au <span style={{ fontWeight: '500', color: '#8B4513' }}>{otpData.phone}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{
                      width: '48px',
                      height: '56px',
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      border: `2px solid ${error ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8B4513';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                ))}
              </div>
              {error && <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: '#dc2626' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              <span>⏱️</span>
              <span>Temps restant :</span>
              <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#8B4513' }}>
                {formatTime(timer)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 6}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isLoading ? 'Vérification...' : 'Vérifier le code'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              style={{
                marginTop: '16px',
                width: '100%',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                background: 'transparent',
                cursor: canResend && !isLoading ? 'pointer' : 'not-allowed',
                color: canResend && !isLoading ? '#8B4513' : '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🔄</span>
              {canResend ? 'Renvoyer le code' : `Attendez ${formatTime(timer)}`}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                marginTop: '8px',
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

export default OTPVerification;