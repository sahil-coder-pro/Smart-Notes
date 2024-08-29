// src/components/notes/ColorPicker.jsx
import { Button } from 'flowbite-react';
import { COLORS as colors } from '../../utils/constants';

// const colors = [
//   '#ffffff', '#fbbf24', '#60a5fa', '#34d399',
//   '#f472b6', '#fb7185', '#a78bfa', '#4f46e5'
// ];

export default function ColorPicker({ selectedColor, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-full border-2 ${
            selectedColor === color ? 'border-black dark:border-white' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}