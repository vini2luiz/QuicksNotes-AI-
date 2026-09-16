# QuickNotes AI 🚀

> Um aplicativo moderno de gerenciamento de notas com autenticação **Google OAuth**, armazenamento com **Row Level Security (RLS) no Supabase** e geração de **resumos automáticos por Inteligência Artificial (Anthropic Claude)**.

---

## 🌟 Funcionalidades

- 🔒 **Autenticação Segura via Google**: Login em 1-clique utilizando Auth.js (NextAuth v5) e Google Provider.
- 🛡️ **Isolamento Total por Usuário (RLS)**: Cada usuário visualiza e gerencia exclusivamente suas próprias notas via políticas de segurança no banco PostgreSQL do Supabase (`user_id`).
- 📝 **CRUD Completo de Notas**:
  - **Criar**: Adicionar notas com título e conteúdo detalhado.
  - **Listar**: Visualizar notas organizadas em cards responsivos e buscar por texto em tempo real.
  - **Editar**: Atualizar título e conteúdo das notas.
  - **Excluir**: Remover notas indesejadas com confirmação.
- 🤖 **Resumo Automático por IA (Claude)**:
  - Botão **"Resumir com IA"** que aciona a API da Anthropic (`claude-3-5-haiku`).
  - Gera um resumo objetivo de 1 a 2 frases em Português do Brasil.
  - O resumo é salvo na nota e destacado com visual especial.
- 🏠 **Landing Page Pública**: Página inicial em `/` com hero, recursos, passo a passo, seção de segurança e CTA — com botão que aponta para o dashboard quando já existe sessão ativa.
- 📱 **Design Moderno & Mobile-First**: Interface desenvolvida em Tailwind CSS com tema escuro (Dark Mode), superfícies de vidro, skeletons de carregamento e animações fluidas.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Autenticação**: [Auth.js / NextAuth v5](https://authjs.dev/) (Google OAuth Provider)
- **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL com Row Level Security)
- **Inteligência Artificial**: [Anthropic SDK](https://www.anthropic.com/) (`claude-3-5-haiku`)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 📁 Estrutura do Projeto

```text
QuickNotes AI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # Endpoint Auth.js
│   │   │   └── notes/
│   │   │       ├── route.ts                 # GET (listar) e POST (criar)
│   │   │       └── [id]/
│   │   │           ├── route.ts             # PUT (editar) e DELETE (excluir)
│   │   │           └── summarize/
│   │   │               └── route.ts         # POST (resumo com Anthropic)
│   │   ├── login/
│   │   │   └── page.tsx                     # Tela de Login Google
│   │   ├── dashboard/
│   │   │   └── page.tsx                     # Painel de notas do usuário
│   │   ├── layout.tsx                       # Root Layout, fontes e metadata
│   │   ├── page.tsx                         # Landing page pública
│   │   └── globals.css                      # Tokens da paleta + Tailwind CSS
│   ├── components/
│   │   ├── landing/
│   │   │   ├── AuroraBackground.tsx         # Fundo decorativo em SVG
│   │   │   ├── LandingNav.tsx               # Navbar da landing (menu mobile)
│   │   │   ├── Hero.tsx                     # Hero + prévia do produto
│   │   │   ├── Features.tsx                 # Grade de recursos
│   │   │   ├── HowItWorks.tsx               # Passo a passo
│   │   │   ├── Security.tsx                 # Segurança e stack
│   │   │   ├── FinalCTA.tsx                 # Chamada final
│   │   │   └── SiteFooter.tsx               # Rodapé
│   │   ├── Header.tsx                       # Topbar navigation & logout
│   │   ├── NoteCard.tsx                     # Card individual com resumo IA
│   │   ├── NoteModal.tsx                    # Modal de criar/editar nota
│   │   ├── Providers.tsx                    # Session Provider wrapper
│   │   └── Skeleton.tsx                     # Skeletons de carregamento
│   ├── lib/
│   │   ├── anthropic.ts                     # Cliente da API da Anthropic
│   │   ├── auth.ts                          # Configuração do Auth.js
│   │   ├── supabase.ts                      # Cliente do Supabase Database
│   │   └── utils.ts                         # Helpers e formatadores
│   └── types/
│       └── index.ts                         # Interfaces TypeScript
├── supabase/
│   └── schema.sql                           # Script de tabela e políticas RLS
├── .env.example                             # Exemplo de variáveis de ambiente
└── README.md
```

---

## ⚡ Como Rodar o Projeto Localmente

### 1. Clonar o repositório e instalar dependências

```bash
cd "QuickNotes AI"
npm install
```

### 2. Configurar as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto copiando o modelo `.env.example`:

```bash
cp .env.example .env.local
```

Preencha com suas credenciais:

```env
AUTH_SECRET="sua_chave_secreta_aqui"
NEXTAUTH_URL="http://localhost:3000"

AUTH_GOOGLE_ID="seu_google_client_id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="seu_google_client_secret"

NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_anon_key_supabase"
SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key_supabase"

ANTHROPIC_API_KEY="sk-ant-api03-sua_chave_anthropic"
```

---

### 3. Configurar o Google Cloud Console (OAuth)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto e acesse a seção **APIs & Services > Credentials**.
3. Crie uma credencial do tipo **OAuth 2.0 Client ID** (Web Application).
4. Adicione as URLs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. Copie o **Client ID** e **Client Secret** para o seu `.env.local`.

---

### 4. Configurar o Supabase (PostgreSQL & RLS)

1. Acesse o seu painel do [Supabase](https://supabase.com/).
2. Vá na seção **SQL Editor**.
3. Copie o conteúdo do arquivo [`supabase/schema.sql`](file:///c:/src/QuickNotes%20AI/supabase/schema.sql) e execute a instrução SQL.
4. Isso criará a tabela `notes`, habilitará o **Row Level Security (RLS)** e as políticas de isolamento para que os usuários só visualizem suas próprias notas.

---

### 5. Executar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para utilizar o aplicativo!

---

## 🧪 Verificação do Projeto (Build Check)

Para garantir que não existem erros de TypeScript ou Linting no código:

```bash
npm run build
```

---

## 🎨 Paleta de Cores (Design Tokens)

A identidade visual usa a paleta **Mercury**: grafite-teal metálico com brilhos
prateados, inspirada nos wallpapers de vidro líquido do iOS. Os tokens ficam
centralizados no bloco `@theme` de [`src/app/globals.css`](src/app/globals.css) —
alterar um token propaga a mudança para toda a aplicação.

| Escala | Uso | Amostras |
| --- | --- | --- |
| `steel-50` → `steel-950` | Fundos, superfícies, textos e bordas | `#f3f7f7` · `#2a3639` · `#0e1517` |
| `aqua-200` → `aqua-700` | Acento principal: CTAs, ícones e destaques de IA | `#8ee2d6` · `#36b3a4` · `#1b7268` |
| `mercury-200` → `mercury-400` | Brilho prateado dos gradientes de marca | `#dfe9ea` · `#9fb5b8` |
| `danger-300` → `danger-500` | Erros e ações destrutivas | `#f2b5ae` · `#d4685b` |

Utilitários próprios disponíveis: `glass` (superfície de vidro fosco) e
`text-mercury` (texto com gradiente metálico).

---

## 🎨 Exemplo Visual (Dashboard)

```text
+-------------------------------------------------------------------------------+
| ✦ QuickNotes AI                          [ (Avatar) Vinicius ]  [ Logout ]   |
+-------------------------------------------------------------------------------+
| [ 🔍 Buscar notas...               ]                            [ + Nova Nota ]|
+-------------------------------------------------------------------------------+
|  +-------------------------------------------------------------------------+  |
|  | Reunião de Arquitetura do Projeto                     📅 24/08/2026      |  |
|  | Definimos que a API do Claude será usada para resumos automáticos...   |  |
|  |                                                                         |  |
|  | ✦ RESUMO POR IA (CLAUDE)                                                |  |
|  | "Reunião focada na definição da arquitetura do projeto QuickNotes AI."  |  |
|  |                                                                         |  |
|  | [ ✨ Atualizar Resumo ]                                [ ✏️ ]  [ 🗑️ ]    |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```
