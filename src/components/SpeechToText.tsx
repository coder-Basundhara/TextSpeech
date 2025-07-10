import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Plus, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SpeechToTextProps {
  onAddNote: (content: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const SpeechToText = ({
  onAddNote,
  isRecording,
  setIsRecording,
}: SpeechToTextProps) => {
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");
  const finalResultsSet = useRef(new Set<string>());

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false);
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    finalTranscriptRef.current = "";
    finalResultsSet.current.clear();

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak now, your voice is being converted to text...",
      });
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const resultTranscript = result[0].transcript.trim();

        if (result.isFinal) {
          // Enhanced duplicate prevention
          const alreadyAdded =
            finalTranscriptRef.current.endsWith(resultTranscript + " ") ||
            finalResultsSet.current.has(resultTranscript);

          if (!alreadyAdded) {
            finalResultsSet.current.add(resultTranscript);
            finalTranscriptRef.current += resultTranscript + " ";
          }
        } else {
          interimTranscript += resultTranscript + " ";
        }
      }

      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      toast({
        title: "Recording Error",
        description: "There was an error with speech recognition. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
      setTranscript(finalTranscriptRef.current.trim());
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Your speech has been converted to text successfully!",
      });
    }
  };

  const handleAddNote = () => {
    if (transcript.trim()) {
      onAddNote(transcript.trim());
      setTranscript("");
      finalTranscriptRef.current = "";
      finalResultsSet.current.clear();
      toast({
        title: "Note Added!",
        description: "Your note has been saved successfully.",
      });
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    finalTranscriptRef.current = "";
    finalResultsSet.current.clear();
  };

  if (!isSupported) {
    return (
      <div className="text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/30">
        <p className="text-red-300">Speech recognition is not supported in your browser.</p>
        <p className="text-red-400 text-sm mt-2">Please use Chrome, Edge, or another supported browser.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
            isRecording
              ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="h-6 w-6 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-6 w-6 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {isRecording && (
          <div className="flex items-center space-x-2 text-red-400 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <span className="font-medium">Recording...</span>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      <div className="space-y-4">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your speech will appear here... You can also type directly!"
          className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl resize-none text-lg p-4 backdrop-blur-sm"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Button
            onClick={handleAddNote}
            disabled={!transcript.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Note
          </Button>

          <Button
            onClick={clearTranscript}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-full transition-all duration-300"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
