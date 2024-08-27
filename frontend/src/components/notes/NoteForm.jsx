// src/components/notes/NoteForm.jsx
import { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Label } from 'flowbite-react';
import { debounce } from 'lodash-es';
import LabelsModal from './LabelsModal';
import ColorPicker from './ColorPicker';
import { createNote, updateNote } from '../../services/notes';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const defaultNote = {
  title: '',
  content: '',
  labels: [],
  color: '#ffffff',
  aiResponse: ''
};

export default function NoteForm({ existingNote }) {
  const [note, setNote] = useState(existingNote || defaultNote);
  const [showLabelsModal, setShowLabelsModal] = useState(false);

    const navigate = useNavigate();


  // Debounced auto-save
  const debouncedSave = debounce(async () => {
    if (note._id) {
      await updateNote(note);
    } else {
      const newNote = await createNote(note);
      setNote(newNote);
    }
  }, 3000);

  useEffect(() => {
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [note]);

  // Beforeunload handler
  useEffect(() => {
    const handler = (e) => {
      if (note.title || note.content) {
        e.preventDefault();
        e.returnValue = '';
        debouncedSave.flush();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [note]);

  return (
    <div className="space-y-6 p-4">
      <ColorPicker 
        selectedColor={note.color}
        onChange={(color) => setNote({ ...note, color })}
      />
      
      <TextInput
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        placeholder="Note title"
        className="text-xl font-bold"
      />
      
      <Textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        rows={8}
        placeholder="Start typing..."
        className="min-h-[300px]"
      />

      <div className="flex items-center gap-4">
        <Button onClick={() => setShowLabelsModal(true)}>
          Manage Labels ({note.labels.length})
        </Button>
        <AnalyzeButton note={note} setNote={setNote} />
      </div>

      <LabelsModal
        show={showLabelsModal}
        onClose={() => setShowLabelsModal(false)}
        selectedLabels={note.labels}
        onUpdate={(labels) => setNote({ ...note, labels })}
      />

      <Button
        onClick={() => navigate('/notes/new')}
        className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlus size={24} />
        add
      </Button>
    </div>
  );
}