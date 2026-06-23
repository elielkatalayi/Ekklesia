import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import bibleApi from '../../api/bible.api';
import toast from 'react-hot-toast';

const VerseOfTheDay = ({ translation = 'ostervald' }) => {
  const [verse, setVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadVerseOfTheDay();
  }, [translation]);

  const loadVerseOfTheDay = async () => {
    setIsLoading(true);
    try {
      const response = await bibleApi.getVerseOfTheDay(translation);
      if (response.data.success) {
        setVerse(response.data.data.verse);
      }
    } catch (error) {
      console.error('Erreur chargement verset du jour:', error);
      // Fallback: charger un verset aléatoire
      loadRandomVerse();
    } finally {
      setIsLoading(false);
    }
  };

  const loadRandomVerse = async () => {
    try {
      const response = await bibleApi.getRandomVerse(translation);
      if (response.data.success) {
        setVerse(response.data.data.verse);
        toast.info('Verset aléatoire chargé');
      }
    } catch (error) {
      console.error('Erreur chargement verset aléatoire:', error);
    }
  };

  const refreshVerse = () => {
    loadVerseOfTheDay();
  };

  if (isLoading) {
    return (
      <div className="verse-of-the-day loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="verse-of-the-day empty">
        <p>Aucun verset disponible</p>
        <button onClick={refreshVerse} className="refresh-btn">
          <RefreshCw className="icon" /> Recharger
        </button>
      </div>
    );
  }

  return (
    <div className="verse-of-the-day">
      <div className="verse-header">
        <div className="header-left">
          <Calendar className="icon" />
          <span className="date-label">
            {date.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
        <button onClick={refreshVerse} className="refresh-btn" title="Nouveau verset">
          <RefreshCw className="icon" />
        </button>
      </div>
      
      <div className="verse-content">
        <blockquote>
          <p className="verse-text">"{verse.text}"</p>
          <footer className="verse-reference">
            — {verse.bookName} {verse.chapter}:{verse.verse}
          </footer>
        </blockquote>
      </div>
    </div>
  );
};

export default VerseOfTheDay;