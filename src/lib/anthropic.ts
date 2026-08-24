import Anthropic from '@anthropic-ai/sdk';

/**
 * Gera um resumo direto e conciso de 1-2 frases para o conteúdo de uma nota.
 * Suporta OpenRouter (Modelos 100% Gratuitos como Llama 3.3 70B e Gemini Flash) ou Anthropic Claude.
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

  // 1. Prioridade: OpenRouter (Suporta modelos 100% gratuitos)
  if (openRouterKey && !openRouterKey.includes('placeholder') && !openRouterKey.includes('sua_chave')) {
    try {
      const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';
      
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
        throw new Error(data?.error?.message || `Erro no OpenRouter (${response.status})`);
      }

      const summaryText = data.choices?.[0]?.message?.content;
      if (summaryText) {
        return summaryText.trim();
      }

      throw new Error('Formato de resposta inesperado do OpenRouter.');
    } catch (err: any) {
      console.error('Erro ao chamar a API do OpenRouter:', err);
      throw new Error(err.message || 'Falha ao comunicar com o OpenRouter.');
    }
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
