// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = 
{
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "UserID", type: "text", placeholder: "UserID" },
          password: { label: "Password", type: "password", placeholder: "*******" },
        },
        async authorize(credentials, req) {
          const user = { id: 1, name: "John", email: "example@email.com" }

          if (user) {
            return user;
          }

          return null;
        }
      })
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const isAllowedToSignIn = true;
        if (isAllowedToSignIn) return true
          return false
      },
      async redirect({ url, baseUrl }) {
        if (url.startsWith("/")) return `${baseUrl}${url}`
        if (new URL(url).origin === baseUrl) return url
          return baseUrl
      },
      async session({ session, user, token }) {
        session.accessToken = token.accessToken
        return session
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        if (account) {
          token.accessToken === account.access_token
        }
        return token
      }
    },
    pages: {
      signIn: "/auth/sign-in",
      signOut: "/auth/sign-out",
      error: "/auth/error",
      newUser: "/auth/create-user",
    }
  }


export default NextAuth(authOptions)

