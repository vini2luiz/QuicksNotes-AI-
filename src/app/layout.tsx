import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickNotes AI - Blazing Fast AI Note Taking App",
  description: "Gerencie suas notas com inteligência artificial, resumos automáticos com Anthropic Claude e isolamento total via Supabase RLS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
