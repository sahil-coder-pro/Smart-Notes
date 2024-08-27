import API from './api';

export const fetchNotes = async () => {
  const response = await API.get('/notes');
  if (response.data.data.notes) {
    return response.data.data.notes;
  }
  return [] ;
};

export const updateNote = async (noteData, formData) => {
    console.log("notes data in update request", noteData) ;

  const response = await API.patch(`/notes/${noteData._id}`, formData);
  return response.data.data.note;
};

export const createNote = async (noteData) => {
  const response = await API.post('/notes', noteData);
  return response.data.data.note;
};

export const analyzeNote = async (noteId) => {
  const response = await API.patch(`/notes/analyze/${noteId}`);
  console.log("response after note analysis", response) ;
  return response.data.data.note.aiResponse;
};

export const deleteNote = async (noteId) => {
  await API.delete(`/notes/${noteId}`);
};