
import { useState } from "react";
import { Note } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit3, Trash2, Download, Save, X, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ColorfulCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDownload: (note: Note) => void;
}

export const ColorfulCard = ({ note, onDelete, onUpdate, onDownload }: ColorfulCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    if (editContent.trim()) {
      onUpdate(note.id, editContent);
      setIsEditing(false);
      toast({
        title: "Note Updated!",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
    toast({
      title: "Note Deleted",
      description: "Your note has been removed successfully.",
    });
  };

  const handleDownload = () => {
    onDownload(note);
    toast({
      title: "Note Downloaded",
      description: "Your note has been saved as a text file.",
    });
  };

  return (
    <Card className="group bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl overflow-hidden">
      {/* Colorful Header */}
      <div className={`h-2 bg-gradient-to-r ${note.color}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-lg">
              {note.title}
            </h3>
            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{note.timestamp.toLocaleDateString()}</span>
              <span>{note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content */}
        <div className="space-y-3">
          {isEditing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl resize-none"
              placeholder="Edit your note..."
            />
          ) : (
            <div className="bg-white/5 rounded-xl p-4 min-h-[120px]">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-4 py-2 text-sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-3 py-2 text-sm"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full px-3 py-2 text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                onClick={handleDelete}
                size="sm"
                variant="outline"
                className="border-red-400/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 rounded-full px-3 py-2 text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
