import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface FinalCTAProps {
  isAuthenticated: boolean;
}

export function FinalCTA({ isAuthenticated }: FinalCTAProps) {
  return (
    <section className="relative px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] glass px-6 py-16 text-center sm:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-aqua-400/15 blur-[110px]"
        />
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-aqua-600 via-aqua-400 to-mercury-200 shadow-lg shadow-aqua-600/25 ring-1 ring-white/20">
            <Sparkles className="h-6 w-6 text-steel-950" />
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-mercury sm:text-4xl">
            Comece a resumir suas notas hoje
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-steel-300">
            Entre com sua conta Google e crie sua primeira nota em menos de um
            minuto.
          </p>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="group mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aqua-500 to-aqua-400 px-8 py-3.5 text-sm font-semibold text-steel-950 shadow-xl shadow-aqua-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isAuthenticated ? "Ir para o dashboard" : "Entrar com Google"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
