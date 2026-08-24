import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY || 'placeholder-anthropic-key';

export const anthropicClient = new Anthropic({
  apiKey: apiKey,
});

/**
 * Gera um resumo direto e conciso de 1-2 frases para o conteúdo de uma nota usando Claude.
 * @param content Conteúdo da nota a ser resumida
 * @returns Texto do resumo gerado
 */
export async function generateNoteSummary(content: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('A chave de API da Anthropic (ANTHROPIC_API_KEY) não está configurada nas variáveis de ambiente.');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('O conteúdo da nota está vazio e não pode ser resumido.');
  }

  try {
    // Usando claude-3-5-haiku-20241022 ou claude-3-haiku-20240307 para máxima velocidade e eficiência
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

    throw new Error('Não foi possível extrair o texto do resumo retornado pela IA.');
  } catch (error: any) {
    console.error('Erro ao chamar a API da Anthropic:', error);
    throw new Error(error?.message || 'Falha ao comunicar com a API da Anthropic.');
  }
}
