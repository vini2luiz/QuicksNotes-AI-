const STEPS = [
  {
    step: "01",
    title: "Entre com o Google",
    description:
      "Autenticação em um clique. Sua sessão é criada pelo Auth.js e sua conta é vinculada às suas notas.",
  },
  {
    step: "02",
    title: "Escreva sua nota",
    description:
      "Título e conteúdo em um modal rápido. A nota é gravada no Supabase já sob as políticas de segurança da sua conta.",
  },
  {
    step: "03",
    title: "Resuma com a IA",
    description:
      "Clique em “Resumir com IA” e o Claude devolve a essência da nota em duas frases, destacada no card.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative scroll-mt-20 border-y border-steel-100/10 bg-steel-900/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-aqua-400 uppercase">
            Como funciona
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-steel-50 sm:text-4xl">
            Da ideia ao resumo em três passos
          </h2>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <li key={step} className="relative rounded-2xl glass p-7">
              <span className="text-4xl font-semibold text-mercury">{step}</span>
              <h3 className="mt-4 text-lg font-semibold text-steel-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
