"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

const LINKS = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#seguranca", label: "Segurança" },
];

interface LandingNavProps {
  isAuthenticated: boolean;
}

export function LandingNav({ isAuthenticated }: LandingNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ctaHref = isAuthenticated ? "/dashboard" : "/login";
  const ctaLabel = isAuthenticated ? "Abrir dashboard" : "Entrar com Google";

  return (
    <header className="sticky top-0 z-50 border-b border-steel-100/10 bg-steel-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-aqua-600 via-aqua-400 to-mercury-200 shadow-lg shadow-aqua-500/20 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-steel-950" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-steel-50">
            QuickNotes <span className="text-aqua-400">AI</span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-steel-300 transition-colors hover:text-steel-50"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua-500 to-aqua-400 px-5 py-2.5 text-sm font-semibold text-steel-950 shadow-lg shadow-aqua-600/25 transition-all hover:scale-[1.02] hover:shadow-aqua-500/35 active:scale-[0.98]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Botão do menu mobile */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="rounded-lg p-2 text-steel-300 transition-colors hover:bg-steel-800/60 hover:text-steel-50 md:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Navegação mobile */}
      {isMenuOpen && (
        <div className="border-t border-steel-100/10 bg-steel-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-steel-300 transition-colors hover:bg-steel-800/60 hover:text-steel-50"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-aqua-400 px-5 py-3 text-sm font-semibold text-steel-950"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
