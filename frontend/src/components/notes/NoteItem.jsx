// src/components/notes/NoteItem.jsx
import { Button } from 'flowbite-react';

export default function NoteItem({ note }) {
    console.log(note);
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{note.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{note.content}</p>
      <div className="flex flex-wrap gap-2">
        {note.labels?.map((label) => (
          <span key={label} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {label}
          </span>
        ))}
      </div>
      <Button color="gray" size="sm">Edit</Button>
    </div>
  );
}