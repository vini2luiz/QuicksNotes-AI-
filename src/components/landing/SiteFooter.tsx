import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-steel-100/10 bg-steel-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-aqua-600 via-aqua-400 to-mercury-200">
            <Sparkles className="h-4 w-4 text-steel-950" />
          </span>
          <span className="text-sm font-semibold text-steel-200">
            QuickNotes <span className="text-aqua-400">AI</span>
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs text-steel-400">
          <a href="#recursos" className="transition-colors hover:text-steel-100">
            Recursos
          </a>
          <a
            href="#como-funciona"
            className="transition-colors hover:text-steel-100"
          >
            Como funciona
          </a>
          <a
            href="#seguranca"
            className="transition-colors hover:text-steel-100"
          >
            Segurança
          </a>
          <Link href="/login" className="transition-colors hover:text-steel-100">
            Entrar
          </Link>
        </nav>

        <p className="text-xs text-steel-500">
          © {new Date().getFullYear()} QuickNotes AI
        </p>
      </div>
    </footer>
  );
}
