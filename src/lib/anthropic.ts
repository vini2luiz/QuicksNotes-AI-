import Anthropic from '@anthropic-ai/sdk';

/**
 * Lista de modelos gratuitos ativos do OpenRouter para fallback automático.
 * 'openrouter/free' é o auto-router oficial do OpenRouter que escolhe o modelo gratuito online no momento.
 */
const FREE_OPENROUTER_MODELS = [
  'openrouter/free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'z-ai/glm-5.2:free',
  'minimax/minimax-m3:free',
];

/**
 * Limpa o texto retornado pela IA, removendo rascunhos em inglês ou blocos de raciocínio (<think>...).
 */
function sanitizeSummaryOutput(rawText: string): string {
  if (!rawText) return '';
  
  let cleaned = rawText;

  // 1. Remove blocos no formato <think>...</think> (comum em modelos estilo DeepSeek R1)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // 2. Se o modelo incluiu rascunho de pensamento em inglês (ex: "Here's a thinking process...", "First, the user asked...")
  if (/thinking process|first,\s*the user|let's analyze/i.test(cleaned)) {
    const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
    // Filtra linhas que sejam passos de rascunho (ex: "1. Analyze...", "- velozes...")
    const validLines = lines.filter(line => 
      !/^here's/i.test(line) &&
      !/^first,/i.test(line) &&
      !/^let's/i.test(line) &&
      !/^\d+\./.test(line) &&
      !line.startsWith('- ') &&
      !line.startsWith('* ')
    );

    if (validLines.length > 0) {
      // Pega a última linha limpa (onde fica o resumo final)
      cleaned = validLines[validLines.length - 1];
    }
  }

  // 3. Remove prefixos como "Resumo:" ou aspas desnecessárias
  cleaned = cleaned.replace(/^(resumo|resumo final):\s*/i, '');
  cleaned = cleaned.replace(/^["'«“]([\s\S]*)["'»”]$/, '$1');

  return cleaned.trim();
}

/**
 * Gera um resumo direto e conciso de 1-2 frases para o conteúdo de uma nota.
 * Suporta OpenRouter (Modelos Gratuitos com Auto-Router) ou Anthropic Claude.
 * 
 * @param content Conteúdo da nota a ser resumida
 * @returns Texto do resumo gerado
 */
export async function generateNoteSummary(content: string): Promise<string> {
  if (!content || content.trim().length === 0) {
    throw new Error('O conteúdo da nota está vazio e não pode ser resumido.');
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY || '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY || '';

  // 1. Prioridade: OpenRouter (Modelos 100% gratuitos com fallback)
  if (openRouterKey && !openRouterKey.includes('placeholder') && !openRouterKey.includes('sua_chave')) {
    const envModel = process.env.OPENROUTER_MODEL || 'openrouter/free';
    
    // Lista de modelos a testar em ordem de prioridade
    const candidateModels = Array.from(
      new Set([envModel, 'openrouter/free', ...FREE_OPENROUTER_MODELS])
    );

    let lastError = '';

    for (const model of candidateModels) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://quicks-notes-ai.vercel.app',
            'X-Title': 'QuickNotes AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'Você é um assistente especialista em resumos. Responda APENAS com o resumo final em Português do Brasil. Não inclua pensamentos internos, rascunhos ou texto em inglês.',
              },
              {
                role: 'user',
                content: `Resuma o seguinte texto em EXATAMENTE 1 ou 2 frases curtas, objetivas e em português do Brasil:\n\n"""\n${content}\n"""`,
              },
            ],
            max_tokens: 1000, // Aumentado para permitir que modelos de raciocínio concluam a resposta
            temperature: 0.3,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errMsg = data?.error?.message || `Status HTTP ${response.status}`;
          console.warn(`[OpenRouter] Modelo ${model} falhou: ${errMsg}. Tentando próximo...`);
          lastError = errMsg;
          continue;
        }

        const rawContent = data.choices?.[0]?.message?.content;
        if (rawContent) {
          const cleanResult = sanitizeSummaryOutput(rawContent);
          if (cleanResult) {
            return cleanResult;
          }
        }

        lastError = `O modelo ${model} retornou resposta vazia.`;
      } catch (err: any) {
        console.warn(`[OpenRouter] Erro ao chamar o modelo ${model}:`, err.message);
        lastError = err.message;
      }
    }

    throw new Error(`Falha ao comunicar com o OpenRouter: ${lastError}`);
  }

  // 2. Fallback: Anthropic API
  if (anthropicKey && !anthropicKey.includes('placeholder') && !anthropicKey.includes('sua_chave')) {
    try {
      const anthropicClient = new Anthropic({ apiKey: anthropicKey });
      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: `Resuma o seguinte texto em EXATAMENTE 1 ou 2 frases curtas, objetivas e em português do Brasil. Capture a essência principal da nota sem enrolação:\n\n"""\n${content}\n"""`,
          },
        ],
      });

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        return sanitizeSummaryOutput(firstBlock.text);
      }

      throw new Error('Não foi possível extrair o texto do resumo retornado pelo Claude.');
    } catch (error: any) {
      console.error('Erro ao chamar a API da Anthropic:', error);
      throw new Error(error?.message || 'Falha ao comunicar com a API da Anthropic.');
    }
  }

  // 3. Nenhum provedor configurado
  throw new Error(
    'Nenhuma chave de IA válida encontrada. Adicione OPENROUTER_API_KEY no seu arquivo .env.local (obtida gratuitamente em https://openrouter.ai/keys).'
  );
}
