// src/components/notes/NoteList.jsx
import { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import SearchFilters from './SearchFilters';
import NoteItem from './NoteItem';
import { fetchNotes, deleteNote } from '../../services/notes.js';
import { showToast } from '../../utils/toast';

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  // Get unique labels from all notes
  console.log("notes", typeof notes)
  console.log('notes', notes);
  const allLabels = [...new Set(notes?.flatMap(note => note.labels) || [])];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = `${note.title} ${note.content}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
      
    const matchesLabel = selectedLabel 
      ? note.labels.includes(selectedLabel)
      : true;
      
    const matchesColor = selectedColor
      ? note.color === selectedColor
      : true;

    return matchesSearch && matchesLabel && matchesColor;
  });

  const handleDelete = async (noteId) => {
    if (window.confirm('Delete this note permanently?')) {
      await deleteNote(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
      showToast('Note deleted successfully', 'success');
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      const data = await fetchNotes();
      setNotes(data);
    };
    loadNotes();
  }, []);

  return (
    <div>
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        allLabels={allLabels}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredNotes.map((note) => (
          <Card 
            key={note._id} 
            className="h-min relative"
            style={{ backgroundColor: note.color }}
          >
            <NoteItem note={note} />
            <button
              onClick={() => handleDelete(note._id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Delete note"
            >
              🗑️
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}