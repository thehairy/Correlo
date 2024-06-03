import NextAuth from "next-auth"
import "next-auth/jwt"

import GoogleProvider from "next-auth/providers/google"
import MicrosoftProvider from "next-auth/providers/microsoft-entra-id"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"
import type { NextAuthConfig } from "next-auth"
import type { Provider } from "next-auth/providers"

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        scope: "openid email https://mail.google.com",
        access_type: "offline",
        prompt: 'consent',
        response_type: 'code'
      },
    },
  }),
  MicrosoftProvider({
    name: 'Microsoft',
    tenantId: process.env.AUTH_MICROSOFT_TENANTID,
    clientId: process.env.AUTH_MICROSOFT_ID,
    clientSecret: process.env.AUTH_MICROSOFT_SECRET,
    authorization: {
      params: {
        scope: "openid offline_access email IMAP.AccessAsUser.All profile User.Read"
      }
    }
  })
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  providers,
  basePath: "/auth",
  pages: {
  //  signIn: "/signin"
  },
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
        token.provider = account.provider;
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
      if(token?.provider) {
        session.provider = token.provider;
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
    provider: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: string;
  }
}
