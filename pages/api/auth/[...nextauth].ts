import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from "next";

const prisma = new PrismaClient();
const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      name: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
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
  pages: { signIn: "/auth/sign-in" },
  callbacks: {
    async session({ session, user, token }) {
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

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);

export default authHandler;
