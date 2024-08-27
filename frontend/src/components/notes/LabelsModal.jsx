import { Modal, TextInput, Button } from 'flowbite-react';
import { useState } from 'react';

export default function LabelsModal({ show, onClose, selectedLabels, onSelect }) {
  const [newLabel, setNewLabel] = useState('');
  const [labels, setLabels] = useState(selectedLabels);

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel)) {
      setLabels(prev => [...prev, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (label) => {
    setLabels(prev => prev.filter(l => l !== label));
  };

  const handleSave = () => {
    onSelect(labels);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Manage Labels</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="flex gap-2">
            <TextInput
              placeholder="New label"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
            />
            <Button onClick={handleAddLabel}>Add</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <span 
                key={label} 
                className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-100/10 dark:text-white/80 flex items-center gap-2"
              >
                {label}
                <button 
                  onClick={() => handleRemoveLabel(label)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}