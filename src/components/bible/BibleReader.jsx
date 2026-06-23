import React from 'react';

const BibleReader = ({ verses, isLoading, onVerseClick, bookName, chapter }) => {
  if (isLoading) {
    return (
      <div className="reader-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <div className="reader-empty">
        <p>Aucun verset trouvé pour ce chapitre</p>
      </div>
    );
  }

  return (
    <div className="bible-reader">
      <div className="chapter-title">
        {bookName} {chapter}
      </div>
      <div className="verses-container">
        {verses.map((verse, index) => (
          <div
            key={index}
            className="verse-item"
            onClick={() => onVerseClick && onVerseClick(verse)}
          >
            <span className="verse-number">{verse.verse}</span>
            <span className="verse-text">{verse.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BibleReader;