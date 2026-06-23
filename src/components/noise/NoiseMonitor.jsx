import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';
import noiseApi from '../../api/noise.api';
import toast from 'react-hot-toast';

const NoiseMonitor = ({ currentNoise, onReadingSubmit }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  // Simuler des lectures de bruit (dans une vraie app, utiliser le microphone)
  const simulateNoiseReading = () => {
    // Simuler un niveau de bruit entre 20 et 100 dB
    const dbValue = Math.floor(Math.random() * 80) + 20;
    return dbValue;
  };

  const submitReading = async (dbValue) => {
    try {
      await noiseApi.submitReading({ dbValue, durationSeconds: 1 });
      onReadingSubmit();
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const startListening = () => {
    setIsListening(true);
    toast.success('Surveillance du bruit activée');
    
    // Simuler des lectures toutes les 3 secondes
    const interval = setInterval(() => {
      if (isListening) {
        const dbValue = simulateNoiseReading();
        submitReading(dbValue);
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const stopListening = () => {
    setIsListening(false);
    toast.info('Surveillance du bruit désactivée');
  };

  useEffect(() => {
    let interval;
    if (isListening) {
      interval = startListening();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'silence': return '#94a3b8';
      case 'normal': return '#22c55e';
      case 'elevated': return '#eab308';
      case 'very_high': return '#f97316';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'silence': return '🔇 Silence';
      case 'normal': return '🔉 Normal';
      case 'elevated': return '🔊 Élevé';
      case 'very_high': return '📢 Très élevé';
      case 'danger': return '🚨 Dangereux';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="noise-monitor">
      <div className="monitor-header">
        <h3>📡 Surveillance en temps réel</h3>
        <button
          className={`monitor-btn ${isListening ? 'active' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
        >
          {isListening ? (
            <>
              <MicOff className="icon" /> Arrêter
            </>
          ) : (
            <>
              <Mic className="icon" /> Démarrer
            </>
          )}
        </button>
      </div>

      {isListening && (
        <div className="monitor-status">
          <div className="status-indicator active">
            <Activity className="icon" />
            <span>Surveillance active</span>
          </div>
        </div>
      )}

      {currentNoise && currentNoise.hasData && (
        <div className="monitor-reading">
          <div className="reading-value" style={{ color: getStatusColor(currentNoise.status) }}>
            {currentNoise.currentDb} dB
          </div>
          <div className="reading-status">
            {getStatusLabel(currentNoise.status)}
          </div>
          {currentNoise.classification && (
            <div className="reading-details">
              <p className="reading-message">{currentNoise.classification.message}</p>
              {currentNoise.classification.recommendedAction && (
                <p className="reading-action">💡 {currentNoise.classification.recommendedAction}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="monitor-info">
        <div className="info-item">
          <AlertCircle className="icon" />
          <span>Le moniteur mesure le niveau sonore en décibels (dB)</span>
        </div>
        <div className="info-item">
          <span className="dot green"></span>
          <span>Normal: 30-70 dB</span>
          <span className="dot yellow"></span>
          <span>Élevé: 70-85 dB</span>
          <span className="dot orange"></span>
          <span>Très élevé: 85-100 dB</span>
          <span className="dot red"></span>
          <span>Dangereux: 100+ dB</span>
        </div>
      </div>
    </div>
  );
};

export default NoiseMonitor;