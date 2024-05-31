import NextAuth from "next-auth"
import "next-auth/jwt"

import GoogleProvider from "next-auth/providers/google"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"
import type { NextAuthConfig } from "next-auth"

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid email https://mail.google.com"
        }
      }
    }),
  ],
  basePath: "/auth",
  session: { strategy: 'jwt' },
  callbacks: {
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    async jwt({ token, trigger, session, account, profile, user }) {      
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      // Handle token updates
      if (trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    async session({ session, token }) {      
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token?.idToken) {
        session.idToken = token.idToken;
      }

      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: true, // Enable debug for better logging
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)

declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
