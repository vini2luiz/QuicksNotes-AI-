import {
  Sparkles,
  Search,
  ShieldCheck,
  Zap,
  Smartphone,
  PenLine,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Resumo automático por IA",
    description:
      "Um clique em “Resumir com IA” aciona o Claude e devolve um resumo objetivo de 1 a 2 frases, salvo junto da nota.",
  },
  {
    icon: PenLine,
    title: "CRUD completo de notas",
    description:
      "Crie, edite e exclua notas com título e conteúdo em um modal rápido, sem sair da tela do dashboard.",
  },
  {
    icon: Search,
    title: "Busca em tempo real",
    description:
      "Filtre por título, conteúdo ou pelo resumo gerado pela IA enquanto digita — sem recarregar a página.",
  },
  {
    icon: ShieldCheck,
    title: "Isolamento por usuário",
    description:
      "Políticas de Row Level Security no PostgreSQL do Supabase garantem que cada conta acesse apenas as próprias notas.",
  },
  {
    icon: Zap,
    title: "Login em 1 clique",
    description:
      "Autenticação Google OAuth via Auth.js (NextAuth v5). Sem senhas para lembrar, sem formulário de cadastro.",
  },
  {
    icon: Smartphone,
    title: "Interface mobile-first",
    description:
      "Layout responsivo com superfícies de vidro, skeletons de carregamento e transições suaves em qualquer tela.",
  },
];

export function Features() {
  return (
    <section id="recursos" className="relative scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-aqua-400 uppercase">
            Recursos
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-steel-50 sm:text-4xl">
            Tudo que uma nota precisa. Nada que ela não precisa.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-steel-400">
            Um app enxuto de anotações com a camada de inteligência exatamente
            onde ela faz diferença.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-2xl glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-aqua-400/30"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-steel-100/10 bg-steel-800/60 text-aqua-300 transition-colors group-hover:bg-aqua-500/15 group-hover:text-aqua-200">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-steel-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
