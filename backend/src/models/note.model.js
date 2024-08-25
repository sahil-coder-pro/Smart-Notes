import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  labels: [{ type: String }], // Case-sensitive
  color: { type: String }, // Predefined hex code
  aiResponse: { type: String, default: "" }, // Gemini analysis
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);

export default Note;