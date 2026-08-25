import Anthropic from '@anthropic-ai/sdk';

/**
 * Lista de modelos gratuitos ativos do OpenRouter para fallback automático.
 * 'openrouter/free' é o auto-router oficial do OpenRouter que roteia automaticamente para o modelo gratuito online no momento.
 */
const FREE_OPENROUTER_MODELS = [
  'openrouter/free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'z-ai/glm-5.2:free',
  'minimax/minimax-m3:free',
];

/**
 * Gera um resumo direto e conciso de 1-2 frases para o conteúdo de uma nota.
 * Suporta OpenRouter (Auto-Router Roteador 100% Gratuito) ou Anthropic Claude.
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

  // 1. Prioridade: OpenRouter (Suporta roteamento automático 100% gratuito)
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
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'QuickNotes AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: `Resuma o seguinte texto em EXATAMENTE 1 ou 2 frases curtas, objetivas e em português do Brasil. Capture a essência principal da nota sem enrolação:\n\n"""\n${content}\n"""`,
              },
            ],
            max_tokens: 200,
            temperature: 0.3,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errMsg = data?.error?.message || `Status HTTP ${response.status}`;
          console.warn(`[OpenRouter] Modelo ${model} falhou: ${errMsg}. Tentando próximo modelo...`);
          lastError = errMsg;
          continue;
        }

        let summaryText = data.choices?.[0]?.message?.content;
        
        // Se a resposta vier vazia no content mas houver texto no reasoning ou refusal, limpa
        if (!summaryText && data.choices?.[0]?.message?.reasoning) {
          summaryText = data.choices[0].message.reasoning;
        }

        if (summaryText) {
          // Remove tags de raciocínio de modelos estilo DeepSeek (<think>...</think>)
          summaryText = summaryText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
          if (summaryText) {
            return summaryText;
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
        max_tokens: 200,
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
        return firstBlock.text.trim();
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
