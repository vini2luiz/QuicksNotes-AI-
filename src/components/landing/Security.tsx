import { Lock, Database, KeyRound, ServerCog } from "lucide-react";

const GUARANTEES = [
  {
    icon: Lock,
    title: "Row Level Security",
    description:
      "Cada consulta ao PostgreSQL é filtrada por user_id diretamente no banco, não apenas na aplicação.",
  },
  {
    icon: KeyRound,
    title: "OAuth do Google",
    description:
      "Nenhuma senha é armazenada. A identidade é verificada pelo próprio Google via Auth.js (NextAuth v5).",
  },
  {
    icon: ServerCog,
    title: "Chaves apenas no servidor",
    description:
      "A API da Anthropic é chamada em Route Handlers. A chave nunca chega ao navegador do usuário.",
  },
  {
    icon: Database,
    title: "Seus dados, seu controle",
    description:
      "As notas ficam no seu projeto Supabase, com schema aberto e versionado junto do código.",
  },
];

const STACK = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Auth.js",
  "Anthropic Claude",
];

export function Security() {
  return (
    <section id="seguranca" className="relative scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-aqua-400 uppercase">
              Segurança
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-steel-50 sm:text-4xl">
              Privacidade garantida pelo banco de dados
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel-400">
              O isolamento entre contas não depende de um <code className="rounded bg-steel-800/80 px-1.5 py-0.5 text-[13px] text-aqua-200">if</code> no
              código da aplicação: ele é aplicado pelas políticas de segurança do
              próprio PostgreSQL.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {STACK.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-steel-100/10 bg-steel-800/50 px-3.5 py-1.5 text-xs font-medium text-steel-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {GUARANTEES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl glass p-5">
                <Icon className="h-5 w-5 text-aqua-300" />
                <h3 className="mt-4 text-sm font-semibold text-steel-100">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-steel-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
