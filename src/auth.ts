import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn("⚠️ [Auth.js] Google OAuth Client ID ou Client Secret não encontrados nas variáveis de ambiente (.env.local).");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || session.user.email || "";
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Sem adapter de banco, o Auth.js gera um `user.id` aleatório (crypto.randomUUID())
      // a cada login, o que faria as notas mudarem de dono a cada nova sessão.
      // O `providerAccountId` é o `sub` do Google: estável e permanente para a conta.
      if (account?.providerAccountId) {
        token.sub = account.providerAccountId;
      } else if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
