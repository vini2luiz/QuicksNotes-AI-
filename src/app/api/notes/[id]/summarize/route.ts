import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase";
import { generateNoteSummary } from "@/lib/anthropic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/notes/[id]/summarize - Gera e salva um resumo por IA da nota usando Anthropic Claude
export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado. Por favor faça login." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const userId = session.user.id || session.user.email;

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Parâmetro ID da nota inválido." },
        { status: 400 }
      );
    }

    // 1. Buscar a nota no Supabase e verificar se pertence ao usuário
    const { data: note, error: fetchError } = await supabaseServer
      .from("notes")
      .select("*")
      .eq("id", id)
      .or(`user_id.eq.${userId},user_id.eq.${session.user.email}`)
      .single();

    if (fetchError || !note) {
      return NextResponse.json(
        { error: "Nota não encontrada ou você não tem permissão para acessá-la." },
        { status: 404 }
      );
    }

    if (!note.content || !note.content.trim()) {
      return NextResponse.json(
        { error: "A nota precisa ter conteúdo para gerar um resumo." },
        { status: 400 }
      );
    }

    // 2. Gerar resumo com Anthropic Claude
    let aiSummaryText = "";
    try {
      aiSummaryText = await generateNoteSummary(note.content);
    } catch (aiErr: any) {
      return NextResponse.json(
        { error: aiErr.message || "Erro ao gerar resumo na API da Anthropic." },
        { status: 502 }
      );
    }

    // 3. Atualizar nota no banco com o novo resumo
    const { data: updatedNote, error: updateError } = await supabaseServer
      .from("notes")
      .update({
        ai_summary: aiSummaryText,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao salvar o resumo no Supabase:", updateError);
      return NextResponse.json(
        { error: "Resumo gerado, mas falhou ao salvar no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedNote,
      message: "Resumo gerado e salvo com sucesso!",
    });
  } catch (err: any) {
    console.error("Erro inesperado em /api/notes/[id]/summarize:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o resumo." },
      { status: 500 }
    );
  }
}
