import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/notes/[id] - Editar uma nota existente
export async function PUT(req: Request, context: RouteContext) {
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
        { error: "Parâmetros inválidos para atualização." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, content, ai_summary } = body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updatePayload.title = title.trim();
    if (content !== undefined) updatePayload.content = content.trim();
    if (ai_summary !== undefined) updatePayload.ai_summary = ai_summary;

    // Atualiza a nota garantindo o isolamento por user_id
    const { data: updatedNote, error } = await supabaseServer
      .from("notes")
      .update(updatePayload)
      .eq("id", id)
      .or(`user_id.eq.${userId},user_id.eq.${session.user.email}`)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar nota no Supabase:", error);
      return NextResponse.json(
        { error: "Nota não encontrada ou falha ao atualizar." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedNote });
  } catch (err: any) {
    console.error("Erro inesperado em PUT /api/notes/[id]:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Excluir uma nota existente
export async function DELETE(req: Request, context: RouteContext) {
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
        { error: "Parâmetros inválidos para remoção." },
        { status: 400 }
      );
    }

    // Exclui a nota garantindo que pertence ao usuário logado
    const { error } = await supabaseServer
      .from("notes")
      .delete()
      .eq("id", id)
      .or(`user_id.eq.${userId},user_id.eq.${session.user.email}`);

    if (error) {
      console.error("Erro ao excluir nota no Supabase:", error);
      return NextResponse.json(
        { error: "Falha ao remover a nota." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Nota excluída com sucesso." });
  } catch (err: any) {
    console.error("Erro inesperado em DELETE /api/notes/[id]:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
