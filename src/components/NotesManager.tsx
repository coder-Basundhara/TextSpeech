
import { Note } from "@/pages/Index";
import { ColorfulCard } from "./ColorfulCard";
import { FileText } from "lucide-react";

interface NotesManagerProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NotesManager = ({ notes, setNotes }: NotesManagerProps) => {
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content, title: content.slice(0, 30) + (content.length > 30 ? "..." : "") } : note
    ));
  };

  const downloadNote = (note: Note) => {
    const content = `Title: ${note.title}\nDate: ${note.timestamp.toLocaleString()}\nContent: ${note.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-${note.timestamp.toISOString().split('T')[0]}-${note.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Notes Yet</h3>
        <p className="text-gray-400">Start recording your first note to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Your Notes</h2>
        <div className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
          <span className="text-white text-sm font-medium">{notes.length}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <ColorfulCard
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onUpdate={updateNote}
            onDownload={downloadNote}
          />
        ))}
      </div>
    </div>
  );
};
