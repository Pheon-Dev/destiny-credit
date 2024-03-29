import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();
const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (!username || !password) {
          throw new Error(`User Name | Password is Missing!`);
        }

        const user = await prisma.user.findFirst({
          where: { username: username },
        });

        if (user) {
          if (user?.state === "online") return await prisma.user.update({
            where: { id: user?.id },
            data: { state: "offline" },
          });

          if (user?.password === password) return user;
        }

        throw new Error(`Wrong User Name | Password!`);
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: `${SECRET}`,
  jwt: { secret: `${SECRET}` },
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/sign-in", error: "/auth/error" },
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
