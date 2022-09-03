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
    session: {
      strategy: "jwt"
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        type: "credentials",
        credentials: {
          /* username: { label: "DCL000", type: "text", placeholder: "User Name" }, */
          /* password: { label: "Password", type: "password", placeholder: "*******" }, */
        },
        async authorize(credentials, req) {
          const { username, password } = credentials as { username: string; password: string; }

          if (!username || !password) {
            throw new Error(`${!username ? "User Name" : "Password"} is Missing!`)
          }

          if (username === "DCL000" && password === "ADMIN") return {username: "Admin", id: "0"}
            throw new Error(`Wrong ${username !== "DCL000" ? "User Name" : "Password"}!`)

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
      /* error: "/auth/error", */
      newUser: "/auth/create-user",
    }
  }


export default NextAuth(authOptions)

