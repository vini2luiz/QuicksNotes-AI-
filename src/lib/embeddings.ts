/**
 * Módulo para geração de vetores de embedding usando OpenRouter.
 * Modelo padrão: liquid/lfm-2.5-embedding-350m:free (100% Gratuito)
 */

export interface EmbeddingOptions {
  model?: string;
}

/**
 * Gera um vetor numérico (embedding) a partir de um texto usando a API de embeddings do OpenRouter.
 * 
 * @param text O texto que será convertido em vetor de embedding.
 * @param options Opções adicionais, como modelo customizado.
 * @returns Promessa com o vetor de números (array de floats).
 */
export async function generateEmbedding(
  text: string,
  options?: EmbeddingOptions
): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('O texto fornecido para gerar embedding não pode estar vazio.');
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY || '';

  if (!openRouterKey || openRouterKey.includes('sua_chave') || openRouterKey.includes('placeholder')) {
    throw new Error(
      'Chave OPENROUTER_API_KEY não configurada. Adicione sua chave no arquivo .env.local para gerar embeddings.'
    );
  }

  const model = options?.model || process.env.OPENROUTER_EMBEDDING_MODEL || 'liquid/lfm-2.5-embedding-350m:free';

  try {
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://quicks-notes-ai.vercel.app',
        'X-Title': 'QuickNotes AI',
      },
      body: JSON.stringify({
        model: model,
        input: text.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || `Erro HTTP ${response.status} ao conectar com OpenRouter Embeddings.`;
      throw new Error(errorMessage);
    }

    const embedding = data?.data?.[0]?.embedding;
    if (!Array.isArray(embedding)) {
      throw new Error('Formato de resposta inesperado da API de embedding do OpenRouter.');
    }

    return embedding;
  } catch (err: any) {
    console.error('Erro ao gerar embedding no OpenRouter:', err);
    throw new Error(err.message || 'Falha ao gerar embedding do texto.');
  }
}
