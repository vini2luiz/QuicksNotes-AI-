import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickNotes AI — Suas anotações, resumidas por IA",
  description:
    "Gerencie suas notas com inteligência artificial, resumos automáticos com Anthropic Claude e isolamento total via Supabase RLS.",
  openGraph: {
    title: "QuickNotes AI — Suas anotações, resumidas por IA",
    description:
      "Notas com resumos automáticos gerados pelo Claude, login com Google e privacidade garantida por Row Level Security.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.className} bg-steel-950 text-steel-100 antialiased selection:bg-aqua-400 selection:text-steel-950`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
