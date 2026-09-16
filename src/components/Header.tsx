"use client";

import { signOut, useSession } from "next-auth/react";
import { Sparkles, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-steel-900/80 border-b border-steel-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-aqua-600 via-aqua-400 to-mercury-200 flex items-center justify-center shadow-lg shadow-aqua-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-steel-950" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-steel-200 to-aqua-300 bg-clip-text text-transparent tracking-tight">
              QuickNotes <span className="text-aqua-400">AI</span>
            </span>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 bg-steel-800/60 border border-steel-700/50 py-1.5 px-3 rounded-full">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  width={28}
                  height={28}
                  className="rounded-full ring-2 ring-aqua-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-aqua-600/30 flex items-center justify-center text-aqua-300 text-xs font-semibold">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-steel-200 max-w-[140px] truncate">
                {user.name || user.email}
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sair da conta"
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-steel-400 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg border border-transparent hover:border-danger-500/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
