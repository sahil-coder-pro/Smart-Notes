
import { analyzeNoteWithGemini } from "../utils/aiModel.js";
import Note from "../models/note.model.js";

// Create note
export const createNote = async (req, res) => {
  try {

    let { title, content, labels, color } = req.body;
    // label is not must have
    if (!title || !content || !color) {
      return res.status(400).json({ message: "All fields are required", success: false, data:{} });
    }

    console.log('labels', labels);
    console.log('typeof labels', typeof labels);

    // labels = JSON.parse(labels);

    const note = await Note.create({
      title,
      content,
      labels : labels || [],
      color,
      user: req.user._id,
    });

    if (!note) {
      return res.status(500).json({ message: "Note could not be created", success: false, data:{} });
    }   
    res.status(201).json({ message: "Note created successfully", success: true, data:{note} });

  } catch (err) {
    console.log(err) ;
    res.status(400).json({ message: err.message , success: false, data:{} });
  }
};

export const updateNote = async (req, res) => {
  try {

    const { title, content, labels, color } = req.body;

    // non of them is must to send

    console.log(1) ;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found", success: false, data:{} });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.labels = labels || note.labels;
    note.color = color || note.color;

    const updatedNote = await note.save();

    if (!updatedNote) {
      return res.status(500).json({ message: "Note could not be updated", success: false, data:{} });
    }

    console.log("updated the note successfully", updatedNote) ;
    

    res.status(200).json({ message: "Note updated successfully", success: true, data:{note: updatedNote} });
  }
  catch(err) {
    console.log("Some error occurred while updating the note" ) ;
    res.status(400).json({ message: err.message , success: false, data:{} });
      
  }
}

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.deleteOne({ $and:[{ _id: req.params.id }, { user: req.user._id }] });

    if (!note) {
      return res.status(404).json({ message: "Note does not exist", success: false, data:{} });
    }

    // if (!note.user.equals(req.user._id)) {
    //   return res.status(403).json({ message: "Unauthorized", success: false, data:{} });
    // }
    

    res.status(200).json({ message: "Note deleted successfully", success: true, data:{} });
  } catch (err) {
    console.log("Some error occurred while deleting the note", err ) ;
    res.status(500).json({ message: err.message, success: false, data:{} });
  }
}

// Get notes (filter/search)
export const getNotes = async (req, res) => {
  try {
    // console.log(req.user._id) ;
    let notes = await Note.find({ user: req.user.id }); // LEARN, req.user.id can be used in mongoose because this get the value of _id.toString(), so this works

    // we will be doing this on the frontend itself
    // Filter by label/color
    // if (req.query.label) notes = notes.filter(n => n.label === req.query.label);
    // if (req.query.color) notes = notes.filter(n => n.color === req.query.color);

    // // Search by title/content
    // if (req.query.search) {
    //   notes = searchNotes(req.query.search, notes);
    // }

    if (!notes) {
      return res.status(404).json({ message: "No notes found", success: false, data:{} });
    }

    res.status(200).json({ message: "Notes fetched successfully", success: true, data:{notes} });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false, data:{} });
  }
}

// Analyze note with Gemini
export const analyzeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found', success: false, data:{} });

    // Call Gemini API
    let analysis = '' ;
    try {

        analysis = await analyzeNoteWithGemini(note.content);
    }
    catch(err) {
        console.log(err);
        analysis = 'Some error occurred while analyzing the note'
    }
    note.aiResponse = analysis;
    await note.save();

    res.status(200).json({ message: "Note analyzed successfully", success: true, data:{note} });

    
  } catch (err) {
    res.status(500).json({ message: err.message, success: false, data:{} });
  }
}
