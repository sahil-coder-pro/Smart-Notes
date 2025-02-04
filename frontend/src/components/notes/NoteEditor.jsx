import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Spinner } from 'flowbite-react';
import LabelsModal from './LabelsModal';
import ColorPicker from './ColorPicker';
import { createNote, updateNote, analyzeNote, deleteNote } from '../../services/notes';
import { COLORS } from '../../utils/constants';
import ReactMarkdown from 'react-markdown';
import { MdDelete } from "react-icons/md";
import { useRef } from 'react';

export default function NoteEditor({ note, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    labels: note?.labels || [],
    color: note?.color || COLORS[0]
  });
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingAnalysis = useRef(false) ;

  const handleSubmit = async () => {
    console.log("Editting this note", note) ;
    console.log("form data of note", formData) ;

    // console.log("Editting this note", note._id) ;

    setLoading(true);
    try {
      const savedNote = note?._id 
        ? await updateNote(note, formData)
        : await createNote(formData);
      onSave(savedNote);
      onClose();
    } catch (err) {
      console.error('Failed to save note:', err);
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {

      
      if (!note) {
          console.log("Save this note first")
          return ;
        }
    setLoading(true) ;
    loadingAnalysis.current = true ;

    try {
        console.log("Formdata", formData) ;

      const analysis = await analyzeNote(note._id);
      setFormData(prev => ({
        ...prev,
        aiResponse: analysis
      }));

    } catch (err) {
      console.error('Analysis failed:', err);
    }
    finally {
      loadingAnalysis.current = false ;
      setLoading(false) ;
    }
  };

  const handleNoteDelete = async () => {
    try {
      await deleteNote(note._id);
      onDelete(note) ;
      onClose();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  return (
    <Modal show={true} onClose={onClose} size="4xl">
      <Modal.Header>{note?._id ? 'Edit Note' : 'New Note'}</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">

          <MdDelete className='ml-auto dark:text-gray-400' onClick = {handleNoteDelete} />
            
          <TextInput
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          
          <Textarea
            rows={8}
            placeholder="Content"
            value={formData.content}
            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          />
        
          {(formData.aiResponse || note?.aiResponse) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
              <h4 className="font-semibold mb-2 dark:text-white">AI Insights</h4>
              <div className="text-gray-600 dark:text-gray-300">
                <ReactMarkdown >

                {formData.aiResponse ? formData.aiResponse : note.aiResponse}
                </ReactMarkdown>
                </div>
            </div>
          )}
          
          <div className="flex-col  sm:flex-row flex gap-4  ">
            <Button onClick={() => setShowLabelsModal(true)}>
              Labels ({formData.labels.length})
            </Button>
            
            <ColorPicker
              selectedColor={formData.color}
              onChange={color => setFormData(prev => ({ ...prev, color }))}
            />
            
            <Button gradientMonochrome="teal" onClick={handleAnalyze} disabled={loadingAnalysis.current}>
              {(loading && loadingAnalysis.current) ? <Spinner/>  : (formData.aiResponse || note?.aiResponse) ? "Analyze" :'AI Analysis'}
            </Button>
          </div>
          
          
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner/> : 'Save Note'}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>

      <LabelsModal
        show={showLabelsModal}
        onClose={() => setShowLabelsModal(false)}
        selectedLabels={formData.labels}
        onSelect={labels => setFormData(prev => ({ ...prev, labels }))}
      />
    </Modal>
  );
}