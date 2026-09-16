"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Note } from "@/types";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { NoteModal } from "@/components/NoteModal";
import { NoteSkeletonGrid } from "@/components/Skeleton";
import { Plus, Search, FileText, AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Redireciona para /login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Carregar lista de notas
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notes");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Falha ao carregar as notas.");
      }

      setNotes(json.data || []);
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com a API de notas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes();
    }
  }, [status]);

  // Filtragem de notas pela busca
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        (n.ai_summary && n.ai_summary.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  // Handler para Salvar (Criar ou Editar)
  const handleSaveNote = async (title: string, content: string, noteId?: string) => {
    if (noteId) {
      // Editar
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao atualizar a nota.");

      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? json.data : n))
      );
    } else {
      // Criar
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar a nota.");

      setNotes((prev) => [json.data, ...prev]);
    }
  };

  // Handler para Excluir
  const handleDeleteNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao excluir a nota.");

    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Handler para atualizar o estado local após o resumo por IA
  const handleSummarizeSuccess = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
  };

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-steel-950 flex items-center justify-center">
        <NoteSkeletonGrid />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-950 text-steel-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-steel-900/60 p-4 rounded-2xl border border-steel-800/80 backdrop-blur-md">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em títulos, conteúdos ou resumos..."
              className="w-full bg-steel-800/60 border border-steel-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-steel-100 placeholder:text-steel-500 focus:outline-none focus:ring-2 focus:ring-aqua-500/40 focus:border-aqua-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotes}
              title="Recarregar notas"
              className="p-2.5 rounded-xl bg-steel-800/60 hover:bg-steel-800 text-steel-300 hover:text-white border border-steel-700/50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-aqua-500 to-aqua-400 hover:from-aqua-400 hover:to-aqua-300 text-steel-950 text-sm font-semibold shadow-lg shadow-aqua-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Nota</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-2xl text-danger-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-danger-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchNotes}
              className="px-3 py-1 bg-danger-500/20 hover:bg-danger-500/30 rounded-lg text-xs font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Content Section */}
        {isLoading ? (
          <NoteSkeletonGrid />
        ) : filteredNotes.length === 0 ? (
          <div className="py-16 px-4 text-center bg-steel-900/40 border border-steel-800/60 rounded-3xl flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-2xl bg-aqua-600/10 text-aqua-400">
              <FileText className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-steel-200">
                {searchQuery ? "Nenhuma nota encontrada" : "Sua coleção está vazia"}
              </h3>
              <p className="text-sm text-steel-400 max-w-sm">
                {searchQuery
                  ? "Nenhuma nota atende aos critérios de busca informados."
                  : "Crie sua primeira nota e utilize a inteligência artificial para gerar resumos automáticos."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-aqua-500 hover:bg-aqua-400 text-steel-950 text-xs font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Criar primeira nota</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteNote}
                onSummarizeSuccess={handleSummarizeSuccess}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        editingNote={editingNote}
      />
    </div>
  );
}
