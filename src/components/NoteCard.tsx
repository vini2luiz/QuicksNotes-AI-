"use client";

import { useState } from "react";
import { Note } from "@/types";
import { formatDate } from "@/lib/utils";
import { Sparkles, Edit3, Trash2, Loader2, Calendar, AlertCircle } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSummarizeSuccess: (updatedNote: Note) => void;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onSummarizeSuccess,
}: NoteCardProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/notes/${note.id}/summarize`, {
        method: "POST",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Erro ao solicitar o resumo por IA.");
      }

      if (json.data) {
        onSummarizeSuccess(json.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Falha na geração do resumo.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;

    setIsDeleting(true);
    try {
      await onDelete(note.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
      <div>
        {/* Top bar: Title + Date */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-2">
            {note.title}
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 bg-slate-800/60 py-1 px-2.5 rounded-full border border-slate-700/40">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formatDate(note.created_at)}
          </span>
        </div>

        {/* Note Content */}
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-5 line-clamp-6">
          {note.content}
        </p>

        {/* Error message feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* AI Summary Section */}
        {note.ai_summary && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-xs tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resumo por IA (Claude)</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed italic">
              "{note.ai_summary}"
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
        {/* Summarize Button */}
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || isDeleting}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-100 border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-200 disabled:opacity-50"
        >
          {isSummarizing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Resumindo...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{note.ai_summary ? "Atualizar Resumo" : "Resumir com IA"}</span>
            </>
          )}
        </button>

        {/* Edit & Delete Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(note)}
            disabled={isSummarizing || isDeleting}
            title="Editar nota"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isSummarizing || isDeleting}
            title="Excluir nota"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
