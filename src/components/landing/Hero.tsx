import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, Edit3, Trash2 } from "lucide-react";
import { AuroraBackground } from "./AuroraBackground";

interface HeroProps {
  isAuthenticated: boolean;
}

export function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <AuroraBackground />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide text-steel-200">
            <Sparkles className="h-3.5 w-3.5 text-aqua-300" />
            Resumos automáticos com Anthropic Claude
          </span>

          <h1 className="mt-7 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-mercury">Suas anotações,</span>
            <br />
            <span className="text-mercury">resumidas por IA</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg">
            Escreva rápido, encontre na hora e deixe a inteligência artificial
            transformar cada nota em um resumo objetivo. Privado por padrão,
            protegido por Row Level Security.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aqua-500 to-aqua-400 px-7 py-3.5 text-sm font-semibold text-steel-950 shadow-xl shadow-aqua-600/25 transition-all hover:scale-[1.02] hover:shadow-aqua-500/40 active:scale-[0.98] sm:w-auto"
            >
              {isAuthenticated ? "Abrir meu dashboard" : "Começar gratuitamente"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#recursos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold text-steel-100 transition-colors hover:text-white sm:w-auto"
            >
              Ver recursos
            </a>
          </div>

          <p className="mt-5 text-xs text-steel-400">
            Login em 1 clique com Google · Sem cartão de crédito
          </p>
        </div>

        {/* Prévia do produto */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="absolute -inset-x-10 -top-10 bottom-0 rounded-[2.5rem] bg-aqua-500/5 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl glass p-2 shadow-2xl shadow-steel-950/60">
            <div className="rounded-[1.25rem] bg-steel-900/80 p-5 sm:p-7">
              {/* Barra de janela */}
              <div className="mb-6 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-steel-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-steel-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-steel-700" />
                <span className="ml-3 text-[11px] text-steel-500">
                  quicknotes.ai / dashboard
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-steel-100/10 bg-steel-850/70 p-5 text-left">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-steel-100">
                      Reunião de arquitetura
                    </h3>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-steel-100/10 bg-steel-800/70 px-2 py-0.5 text-[10px] text-steel-400">
                      <Calendar className="h-3 w-3" />
                      16 set
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-steel-400">
                    Definimos o uso da API do Claude para resumos automáticos e o
                    isolamento por usuário via políticas RLS no Supabase.
                  </p>
                  <div className="mt-4 rounded-xl border border-aqua-500/25 bg-gradient-to-r from-aqua-700/15 via-steel-800/60 to-steel-900 p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-aqua-300 uppercase">
                      <Sparkles className="h-3 w-3" />
                      Resumo por IA
                    </div>
                    <p className="text-[11px] leading-relaxed text-steel-200 italic">
                      &ldquo;Reunião definiu Claude para resumos e RLS para
                      isolamento de dados por usuário.&rdquo;
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-steel-100/10 pt-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-aqua-500/25 bg-aqua-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-aqua-300">
                      <Sparkles className="h-3 w-3" />
                      Atualizar resumo
                    </span>
                    <span className="flex items-center gap-1 text-steel-500">
                      <Edit3 className="h-3.5 w-3.5" />
                      <Trash2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>

                <div className="space-y-4">
                  <article className="rounded-2xl border border-steel-100/10 bg-steel-850/70 p-5 text-left">
                    <h3 className="mb-2 text-sm font-semibold text-steel-100">
                      Roadmap do trimestre
                    </h3>
                    <div className="space-y-2">
                      <span className="block h-2 w-full rounded-full bg-steel-700/70" />
                      <span className="block h-2 w-5/6 rounded-full bg-steel-700/60" />
                      <span className="block h-2 w-2/3 rounded-full bg-steel-700/50" />
                    </div>
                  </article>
                  <article className="rounded-2xl border border-steel-100/10 bg-steel-850/70 p-5 text-left">
                    <h3 className="mb-2 text-sm font-semibold text-steel-100">
                      Ideias de produto
                    </h3>
                    <div className="space-y-2">
                      <span className="block h-2 w-3/4 rounded-full bg-steel-700/70" />
                      <span className="block h-2 w-full rounded-full bg-steel-700/60" />
                      <span className="block h-2 w-1/2 rounded-full bg-steel-700/50" />
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
