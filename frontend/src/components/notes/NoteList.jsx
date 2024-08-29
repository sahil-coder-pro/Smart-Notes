import { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa';
import NoteEditor from './NoteEditor';
import Filters from './Filters';
import { fetchNotes } from '../../services/notes';
import { useAuth } from '../../contexts/AuthContext';


export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    label: '',
    color: ''
  });
  const { user, loading } = useAuth();

  const filteredNotes = notes.filter(note => {
    const searchMatch = `${note.title} ${note.content}`
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const labelMatch = filters.label ? note.labels?.includes(filters.label) : true;
    const colorMatch = filters.color ? note.color === filters.color : true;
    return searchMatch && labelMatch && colorMatch;
  });

  useEffect(() => {
    console.log('notes', notes) ;
  }, [notes])

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (err) {
        console.error('Failed to load notes:', err);
        setNotes([]);
      }
    };

    // Clear notes when user changes
    setNotes([]);
    if (user && !loading) loadNotes();
  }, [user, loading]);

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      <Filters filters={filters} setFilters={setFilters} notes={notes} />
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4  md:pr-2">
        {filteredNotes.map(note => (
          <Card 
            key={note._id} 
            className="break-inside-avoid mb-4 dark:bg-gray-800 cursor-pointer"
            style={{backgroundColor: note.color, filter: "brightness(1.4))"}}
            onClick={() => {
              setSelectedNote(note);
              setShowEditor(true);
            }}
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold dark:text-white break-words">{note.title}</h3>
              <p className="text-gray-200 dark:text-gray-200 break-words">{note.content}</p>
              <div className="flex flex-wrap gap-2">
                {note.labels?.map(label => (
                  <span 
                    key={label}
                    className="px-2 py-1 rounded bg-gray-200/40 dark:bg-gray-200/40  text-sm  text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        gradientDuoTone="purpleToBlue"
        className="fixed bottom-8 right-8 rounded-full p-4"
        onClick={() => {
          setSelectedNote(null);
          setShowEditor(true);
        }}
      >
        <FaPlus size={20} />
      </Button>

      {showEditor && (
        <NoteEditor 
          note={selectedNote} 
          onClose={() => setShowEditor(false)}
          onDelete = {(existingNote) => {
            setNotes(prev => prev.filter(n => n._id !== existingNote._id));
          }}
          onSave={(newNote) => {
            setNotes(prev => 
              selectedNote 
                ? (
                  prev.map(n => n._id === newNote._id ? newNote : n)
                )
                : [newNote, ...prev]
            );
          }}
        />
      )}
    </div>
  );
}