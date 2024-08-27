// src/components/notes/AnalyzeButton.jsx
import { Button, Spinner } from 'flowbite-react';
import { analyzeNote } from '../../services/notes';
import { showToast } from '../../utils/toast';

export default function AnalyzeButton({ note, setNote }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!note._id) {
        showToast('Please save the note first', 'error');
        return ;
    }
    try {
      setIsAnalyzing(true);
    
      console.log("sendind for analysis", note) ; ;
      const analysis = await analyzeNote(note._id);
      setNote({ ...note, aiResponse: analysis });
      showToast('Analysis completed!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleAnalyze}
      disabled={isAnalyzing || !note.content}
      gradientDuoTone="purpleToBlue"
    >
      {isAnalyzing ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Analyzing...
        </>
      ) : (
        '✨ AI Analysis'
      )}
    </Button>
  );
}