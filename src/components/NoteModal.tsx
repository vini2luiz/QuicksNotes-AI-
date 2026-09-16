"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types";
import { X, Save, Loader2, Sparkles } from "lucide-react";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, noteId?: string) => Promise<void>;
  editingNote?: Note | null;
}

export function NoteModal({
  isOpen,
  onClose,
  onSave,
  editingNote,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
    setError(null);
  }, [editingNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(title.trim(), content.trim(), editingNote?.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar a nota.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-steel-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-steel-900 border border-steel-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-steel-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-aqua-600/20 text-aqua-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-steel-100">
              {editingNote ? "Editar Nota" : "Criar Nova Nota"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-steel-400 uppercase tracking-wider mb-1.5">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Idéias para o projeto QuickNotes"
              className="w-full bg-steel-800/60 border border-steel-700/60 rounded-xl px-4 py-2.5 text-steel-100 text-sm focus:outline-none focus:ring-2 focus:ring-aqua-500/50 focus:border-aqua-500 transition-all placeholder:text-steel-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-steel-400 uppercase tracking-wider mb-1.5">
              Conteúdo
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Escreva os detalhes da sua nota aqui..."
              className="w-full bg-steel-800/60 border border-steel-700/60 rounded-xl px-4 py-3 text-steel-100 text-sm focus:outline-none focus:ring-2 focus:ring-aqua-500/50 focus:border-aqua-500 transition-all placeholder:text-steel-500 resize-none leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-steel-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-aqua-500 hover:bg-aqua-400 text-steel-950 shadow-lg shadow-aqua-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingNote ? "Salvar Alterações" : "Criar Nota"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
