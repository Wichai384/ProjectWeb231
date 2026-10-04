import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile) {
        return false;
      }

      const claims = profile as typeof profile & {
        email?: unknown;
        email_verified?: unknown;
      };

      return (
        claims.email_verified === true &&
        typeof claims.email === "string" &&
        claims.email.trim().length > 0
      );
    },
  },
};
