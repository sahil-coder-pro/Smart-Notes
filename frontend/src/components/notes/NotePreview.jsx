// src/components/notes/NotePreview.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNotes } from '../../services/notes';
import NoteItem from './NoteItem';
import { Button } from 'flowbite-react';
import { showToast } from '../../utils/toast';

export default function NotePreview() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const data = await fetchNotes(noteId);
        setNote(data);
      } catch (err) {
        showToast('Note not found', 'error');
      }
    };
    loadNote();
  }, [noteId]);

  if (!note) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow dark:bg-gray-800">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Note Preview</h2>
        <Button as="a" href="/" color="gray">Back to List</Button>
      </div>
      <div 
        className="p-6 rounded-lg shadow"
        style={{ backgroundColor: note.color }}
      >
        <NoteItem note={note} />
      </div>
    </div>
  );
}