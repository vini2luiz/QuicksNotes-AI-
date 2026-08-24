-- ==============================================================================
-- QuickNotes AI - Database Schema (Supabase PostgreSQL)
-- ==============================================================================

-- 1. Criar a tabela 'notes'
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  ai_summary TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index para buscas eficientes por usuário e data de criação
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança RLS (Garante isolamento por usuário)
-- Permite leitura das notas apenas pelo próprio usuário criador
CREATE POLICY "Usuários podem visualizar apenas suas próprias notas"
  ON public.notes FOR SELECT
  USING (
    user_id = auth.uid()::text 
    OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Permite criação de notas atribuídas apenas ao usuário autenticado
CREATE POLICY "Usuários podem criar notas para si mesmos"
  ON public.notes FOR INSERT
  WITH CHECK (
    user_id = auth.uid()::text 
    OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Permite atualização das notas apenas pelo próprio usuário criador
CREATE POLICY "Usuários podem atualizar apenas suas próprias notas"
  ON public.notes FOR UPDATE
  USING (
    user_id = auth.uid()::text 
    OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Permite exclusão das notas apenas pelo próprio usuário criador
CREATE POLICY "Usuários podem deletar apenas suas próprias notas"
  ON public.notes FOR DELETE
  USING (
    user_id = auth.uid()::text 
    OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR user_id = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- 4. Função e Trigger para atualização automática da coluna updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_notes_updated_at ON public.notes;
CREATE TRIGGER set_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
