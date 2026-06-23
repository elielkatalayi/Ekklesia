import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import notesApi from '../../api/notes.api';

const PersonalNotes = ({ verse, bookName, onClose, showAll = false }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Charger les notes
  useEffect(() => {
    if (showAll) {
      loadAllNotes();
    } else if (verse) {
      loadVerseNotes();
    }
  }, [verse, showAll]);

  const loadAllNotes = async () => {
    setIsLoading(true);
    try {
      const response = await notesApi.getNotes();
      if (response.data.success) {
        setNotes(response.data.data.notes || []);
      }
    } catch (error) {
      console.error('Erreur chargement notes:', error);
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadVerseNotes = async () => {
    if (!verse) return;
    const reference = `${bookName || verse.bookName} ${verse.chapter}:${verse.verse}`;
    setIsLoading(true);
    try {
      const response = await notesApi.getNotesByReference('bible', reference);
      if (response.data.success) {
        setNotes(response.data.data.notes || []);
      }
    } catch (error) {
      console.error('Erreur chargement notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      toast.error('Veuillez écrire une note');
      return;
    }

    const reference = verse 
      ? `${bookName || verse.bookName} ${verse.chapter}:${verse.verse}`
      : 'général';

    setIsLoading(true);
    try {
      const response = await notesApi.createNote({
        referenceType: 'bible',
        reference,
        content: newNoteContent.trim(),
        color: '#fef3c7', // Jaune par défaut
      });
      
      if (response.data.success) {
        toast.success('Note ajoutée');
        setNewNoteContent('');
        setShowAddForm(false);
        // Recharger les notes
        if (showAll) {
          loadAllNotes();
        } else {
          loadVerseNotes();
        }
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (noteId, content) => {
    setIsLoading(true);
    try {
      const response = await notesApi.updateNote(noteId, { content });
      if (response.data.success) {
        toast.success('Note mise à jour');
        setEditingNote(null);
        if (showAll) {
          loadAllNotes();
        } else {
          loadVerseNotes();
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette note ?')) return;
    
    setIsLoading(true);
    try {
      const response = await notesApi.deleteNote(noteId);
      if (response.data.success) {
        toast.success('Note supprimée');
        if (showAll) {
          loadAllNotes();
        } else {
          loadVerseNotes();
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Si c'est un panneau latéral pour un verset spécifique
  if (!showAll && verse) {
    return (
      <div className="personal-notes-panel">
        <div className="panel-header">
          <h3>
            Notes - {bookName || verse.bookName} {verse.chapter}:{verse.verse}
          </h3>
          {onClose && (
            <button onClick={onClose} className="close-btn">
              <X className="icon" />
            </button>
          )}
        </div>
        
        <button
          className="add-note-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="icon" /> Ajouter une note
        </button>

        {showAddForm && (
          <div className="note-form">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Écrire votre note..."
              className="note-textarea"
              rows="3"
            />
            <div className="form-actions">
              <button onClick={() => setShowAddForm(false)} className="cancel-btn">
                Annuler
              </button>
              <button onClick={handleAddNote} className="save-btn">
                <Save className="icon" /> Enregistrer
              </button>
            </div>
          </div>
        )}

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="no-notes">Aucune note pour ce verset</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-item">
                {editingNote === note.id ? (
                  <div className="note-edit">
                    <textarea
                      defaultValue={note.content}
                      className="note-textarea"
                      rows="3"
                      onBlur={(e) => handleUpdateNote(note.id, e.target.value)}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={() => setEditingNote(null)} className="cancel-btn">
                        Annuler
                      </button>
                      <button
                        onClick={(e) => {
                          const textarea = e.target.parentElement.previousSibling;
                          handleUpdateNote(note.id, textarea.value);
                        }}
                        className="save-btn"
                      >
                        <Save className="icon" /> Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="note-content">{note.content}</p>
                    <div className="note-actions">
                      <button onClick={() => setEditingNote(note.id)} className="edit-btn">
                        <Edit2 className="icon" />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className="delete-btn">
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Vue de toutes les notes
  return (
    <div className="personal-notes-page">
      <div className="notes-header">
        <h2>📝 Mes notes personnelles</h2>
        <button
          className="add-note-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="icon" /> Nouvelle note
        </button>
      </div>

      {showAddForm && (
        <div className="note-form">
          <input
            type="text"
            placeholder="Référence (ex: Jean 3:16)"
            className="note-reference-input"
          />
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Écrire votre note..."
            className="note-textarea"
            rows="3"
          />
          <div className="form-actions">
            <button onClick={() => setShowAddForm(false)} className="cancel-btn">
              Annuler
            </button>
            <button onClick={handleAddNote} className="save-btn">
              <Save className="icon" /> Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="notes-grid">
        {notes.length === 0 ? (
          <p className="no-notes">Aucune note enregistrée</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-card-header">
                <span className="note-reference">{note.reference}</span>
                <span className="note-date">
                  {new Date(note.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="note-card-content">{note.content}</p>
              <div className="note-card-actions">
                <button onClick={() => setEditingNote(note.id)} className="edit-btn">
                  <Edit2 className="icon" />
                </button>
                <button onClick={() => handleDeleteNote(note.id)} className="delete-btn">
                  <Trash2 className="icon" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalNotes;