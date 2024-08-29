import { TextInput, Select, Button } from 'flowbite-react';

export default function Filters({ filters, setFilters, notes }) {
  const uniqueLabels = [...new Set(notes.flatMap(note => note.labels || []))];
  const uniqueColors = [...new Set(notes.map(note => note.color))];
  // TODO: this is quite inefficient to fetch the labels and colors this way, so we need to optimize it

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <TextInput
        placeholder="Search notes..."
        value={filters.search}
        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
      />
      
      <Select
        value={filters.label}
        onChange={e => setFilters(prev => ({ ...prev, label: e.target.value }))}
      >
        <option value="">All Labels</option>
        {uniqueLabels.map(label => (
          <option key={label} value={label} className='text-ellipsis overflow-hidden max-w-[100px]'>{label}</option>
        ))}
      </Select>
      
      <Select
        value={filters.color}
        onChange={e => setFilters(prev => ({ ...prev, color: e.target.value }))}
      >
        <option className = "bg-white text-black" value="">All Colors</option>
        {uniqueColors.map(color => (
          <option key={color} className = "text-white p-1 self-center outline" value={color} style={{ backgroundColor: color }}>
            {color}
          </option>
        ))}
      </Select>
      
      <Button
        color="gray"
        onClick={() => setFilters({ search: '', label: '', color: '' })}
      >
        Clear Filters
      </Button>
    </div>
  );
}