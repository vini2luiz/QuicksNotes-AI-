"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck, Zap, Lock, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Erro ao iniciar login com Google:", err);
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-steel-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-aqua-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-steel-950 text-steel-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-aqua-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-mercury-400/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Voltar para a landing page */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full border border-steel-100/10 bg-steel-900/60 px-4 py-2 text-xs font-medium text-steel-300 backdrop-blur-md transition-colors hover:text-steel-50"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar ao início</span>
      </Link>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-steel-900/80 border border-steel-800 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-aqua-700/40 relative z-10">
        {/* App Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-aqua-600 via-aqua-400 to-mercury-200 mb-4 shadow-xl shadow-aqua-500/30 ring-1 ring-white/20">
            <Sparkles className="w-8 h-8 text-steel-950" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-steel-200 to-aqua-200 bg-clip-text text-transparent mb-2">
            QuickNotes <span className="text-aqua-400">AI</span>
          </h1>
          <p className="text-steel-400 text-sm leading-relaxed">
            Suas notas com resumos automáticos gerados pela API da Anthropic Claude.
          </p>
        </div>

        {/* Google Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-steel-100 text-steel-900 font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-steel-900" />
            ) : (
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Entrar com Google</span>
          </button>
        </div>

        {/* App Features Pills */}
        <div className="mt-8 pt-6 border-t border-steel-800/80 grid grid-cols-3 gap-2 text-center text-[11px] text-steel-400">
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-steel-800/30">
            <ShieldCheck className="w-4 h-4 text-aqua-300" />
            <span>Supabase RLS</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-steel-800/30">
            <Zap className="w-4 h-4 text-mercury-300" />
            <span>Claude AI</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-steel-800/30">
            <Lock className="w-4 h-4 text-aqua-400" />
            <span>Google Auth</span>
          </div>
        </div>
      </div>
    </main>
  );
}
