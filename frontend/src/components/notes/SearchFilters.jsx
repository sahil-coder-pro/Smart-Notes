// src/components/notes/SearchFilters.jsx
import { Button, TextInput, Select } from 'flowbite-react';

export default function SearchFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedLabel, 
  setSelectedLabel, 
  selectedColor, 
  setSelectedColor,
  allLabels
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
      <TextInput
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <Select
        value={selectedLabel}
        onChange={(e) => setSelectedLabel(e.target.value)}
      >
        <option value="">All Labels</option>
        {allLabels.map((label) => (
          <option key={label} value={label}>{label}</option>
        ))}
      </Select>

      <Select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      >
        <option value="">All Colors</option>
        <option value="#ffffff">White</option>
        <option value="#fbbf24">Amber</option>
        <option value="#60a5fa">Blue</option>
        {/* Add other color options */}
      </Select>

      <Button 
        onClick={() => {
          setSearchQuery('');
          setSelectedLabel('');
          setSelectedColor('');
        }}
        color="gray"
      >
        Clear Filters
      </Button>
    </div>
  );
}