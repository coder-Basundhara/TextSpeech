
import { useState } from "react";
import { SpeechToText } from "@/components/SpeechToText";
import { NotesManager } from "@/components/NotesManager";
import { Mic, FileText, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  color: string;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const addNote = (content: string) => {
    if (content.trim()) {
      const colors = [
        "from-pink-400 to-purple-600",
        "from-blue-400 to-cyan-600", 
        "from-green-400 to-teal-600",
        "from-orange-400 to-red-600",
        "from-yellow-400 to-orange-600",
        "from-indigo-400 to-purple-600"
      ];
      
      const newNote: Note = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        content,
        timestamp: new Date(),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const downloadAllNotes = () => {
    if (notes.length === 0) return;
    
    const content = notes.map(note => 
      `Title: ${note.title}\nDate: ${note.timestamp.toLocaleString()}\nContent: ${note.content}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-violet-500/20 animate-pulse"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Voice Notes
              </h1>
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-bounce">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your voice into beautiful, organized notes with our AI-powered speech-to-text app
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Speech to Text Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Record New Note</h2>
          </div>
          <SpeechToText onAddNote={addNote} isRecording={isRecording} setIsRecording={setIsRecording} />
        </div>

        {/* Stats and Download Section */}
        {notes.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold text-white">{notes.length}</p>
              <p className="text-gray-300">Total Notes</p>
            </div>
            <Button
              onClick={downloadAllNotes}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download All Notes
            </Button>
          </div>
        )}

        {/* Notes Manager */}
        <NotesManager notes={notes} setNotes={setNotes} />
      </div>
    </div>
  );
};

export default Index;
