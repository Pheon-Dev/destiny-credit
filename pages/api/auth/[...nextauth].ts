// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Session } from "../../../lib/session";
import { hash, compare } from "bcryptjs";

type Props = {
  password: string;
  hashedPassword: string;
}

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "SignIn",
      type: "credentials",
      credentials: {
        /* username: { label: "DCL000", type: "text", placeholder: "User Name" }, */
        /* password: { label: "Password", type: "password", placeholder: "*******" }, */
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (!username || !password) {
          throw new Error(
            `${!username ? "User Name" : "Password"} is Missing!`
          );
        }

        try {
          let maybe_user = await prisma.user.findFirst({
            where: {
              username: username,
            },
            select: {
              id: true,
              username: true,
              password: true,
              role: true,
            },
          });
          /* if (username === "DCL000" && password === "ADMIN") */
          /*   return { username: "Admin", id: "0" }; */

          if (!maybe_user) {
            if (!username || !password)
              throw new Error("Invalid Credentials!");
          }
          const hashed_password = await hash(password, 12)
          maybe_user = await prisma.user.create({
            data: {
              username: username,
              password: hashed_password
            },
            select: {
              id: true,
              username: true,
              password: true,
              role: true,
            }
          })

          if (maybe_user) {
            const isValid = await compare(password, maybe_user.password);
            if (!isValid) {
              throw new Error("Invalid User Credentials!")
            }
          }
        } catch (error) {
          console.log(error);
        }
        throw new Error(`Wrong User Name | Password!`);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) return true;
      return false;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user, token }) {
      /* const sesh: Session = { */
      /*   ...session, */
      /*   user: { */
      /*     ...session.user, */
      /*     id: token., */
      /*   } */
      /* } */
      /* session.accessToken = token.accessToken; */
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      /* if (user) { */
      /*   token.sub === account.access_token; */
      /* } */
      /* return token; */
      if (account) {
        token.accessToken === account.access_token;
      }
      return token;
    },
  },
  secret: `${SECRET}`,
  jwt: {
    secret: `${SECRET}`,
    /* encode: , */
  },
  pages: {
    signIn: "/auth/sign-in",
    /* signOut: "/auth/sign-out", */
    /* error: "/auth/error", */
    newUser: "/auth/create-user",
  },
};

export default NextAuth(authOptions);
