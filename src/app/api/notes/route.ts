import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase";

// GET /api/notes - Listar todas as notas do usuário autenticado
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado. Por favor faça login." },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email;

    if (!userId) {
      return NextResponse.json(
        { error: "Identificador de usuário inválido na sessão." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    if (!supabaseUrl || supabaseUrl.includes("seu-projeto.supabase.co")) {
      return NextResponse.json(
        { error: "Por favor, configure as credenciais reais do Supabase (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY) no seu arquivo .env.local." },
        { status: 500 }
      );
    }

    // Busca apenas as notas pertencentes ao usuário autenticado
    const { data: notes, error } = await supabaseServer
      .from("notes")
      .select("*")
      .or(`user_id.eq.${userId},user_id.eq.${session.user.email}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar notas no Supabase:", error);
      return NextResponse.json(
        { error: `Erro ao conectar com o Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: notes || [] });
  } catch (err: any) {
    console.error("Erro inesperado em GET /api/notes:", err);
    if (err?.message?.includes("ENOTFOUND") || err?.cause?.code === "ENOTFOUND") {
      return NextResponse.json(
        { error: "Não foi possível conectar à URL do Supabase fornecida. Verifique a variável NEXT_PUBLIC_SUPABASE_URL no arquivo .env.local." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

// POST /api/notes - Criar uma nova nota para o usuário autenticado
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado. Por favor faça login." },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email;

    if (!userId) {
      return NextResponse.json(
        { error: "Identificador de usuário inválido na sessão." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    if (!supabaseUrl || supabaseUrl.includes("seu-projeto.supabase.co")) {
      return NextResponse.json(
        { error: "Por favor, configure as credenciais reais do Supabase no arquivo .env.local antes de criar notas." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "O título da nota é obrigatório." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "O conteúdo da nota é obrigatório." },
        { status: 400 }
      );
    }

    const { data: newNote, error } = await supabaseServer
      .from("notes")
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          content: content.trim(),
          ai_summary: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir nota no Supabase:", error);
      return NextResponse.json(
        { error: `Erro ao salvar nota no Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: newNote }, { status: 201 });
  } catch (err: any) {
    console.error("Erro inesperado em POST /api/notes:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao criar nota." },
      { status: 500 }
    );
  }
}
