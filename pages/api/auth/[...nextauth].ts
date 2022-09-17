// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Session } from "../../../lib/session";
import { hash, compare } from "bcryptjs";
import axios from "axios";

type Props = {
  password: string;
  hashedPassword: string;
};
/* Checkout */
/* https://blog.devso.io/implementing-credentials-provider-on-nextjs-and-nextauth */
const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const prisma = new PrismaClient();

export async function verify({ password, hashedPassword }: Props) {
  const isValid = compare(password, hashedPassword);
  return isValid;
}
const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        /* username: { label: "DCL000", type: "text", placeholder: "User Name" }, */
        /* password: { */
        /*   label: "Password", */
        /*   type: "password", */
        /*   placeholder: "*******", */
        /* }, */
      },
      authorize: async (credentials, req) => {
        /* const user = await axios */
        /*   .request({ */
        /*     url: `${process.env.NEXTAUTH_URL}/api/user/check-credentials`, */
        /*     method: "POST", */
        /*     headers: { */
        /*       "Content-Type": "application/x-www-form-urlencoded", */
        /*       accept: "application/json", */
        /*     }, */
        /*     data: Object.entries(credentials) */
        /*       .map((e) => e.join("=")) */
        /*       .join("&"), */
        /*   }) */
        /*   .then((res) => res.data) */
        /*   .catch((e) => { */
        /*     return null; */
        /*   }); */
        /**/
        /* if (user) { */
        /*   return user; */
        /* } */
        /* return null; */

        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (!username || !password) {
          throw new Error(
            `User Name | Password is Missing!`
          );
        }

        if (username === "DCL000" && password === "ADMIN")
          return {
          id: 1,
          name: "Admin",
          email: "admin@email.com"
          };

        /* try { */
        /*   let maybe_user = await prisma.user.findFirst({ */
        /*     where: { */
        /*       username: username, */
        /*     }, */
        /*     select: { */
        /*       id: true, */
        /*       username: true, */
        /*       password: true, */
        /*       role: true, */
        /*     }, */
        /*   }); */
        /**/
        /*   if (!maybe_user) { */
        /*     if (!username || !password) throw new Error("Invalid Credentials!"); */
        /*     const hashed_password = await hash(password, 12); */
        /*     maybe_user = await prisma.user.create({ */
        /*       data: { */
        /*         username: username, */
        /*         password: hashed_password, */
        /*       }, */
        /*       select: { */
        /*         id: true, */
        /*         username: true, */
        /*         password: true, */
        /*         role: true, */
        /*       }, */
        /*     }); */
        /*   } else { */
        /*     const hashed_password = maybe_user.password; */
        /*     const isValid = await verify(password, hashed_password); */
        /*     if (!isValid) { */
        /*       throw new Error("Invalid User Credentials!"); */
        /*     } */
        /*   } */
        /**/
        /*   return { */
        /*     id: maybe_user.id, */
        /*     username: maybe_user.username, */
        /*     role: maybe_user.role, */
        /*   }; */
        /* } catch (error) { */
        /*   console.log(error); */
        /* } */

        throw new Error(`Wrong User Name | Password!`);
      },
    }),
  ],
  /* callbacks: { */
  /*   async signIn({ user, account, profile, email, credentials }) { */
  /*     const isAllowedToSignIn = true; */
  /*     if (isAllowedToSignIn) return true; */
  /*     return false; */
  /*   }, */
  /*   async redirect({ url, baseUrl }) { */
  /*     if (url.startsWith("/")) return `${baseUrl}${url}`; */
  /*     if (new URL(url).origin === baseUrl) return url; */
  /*     return baseUrl; */
  /*   }, */
  /*   async session({ session, user, token }) { */
      /* const sesh: Session = { */
      /*   ...session, */
      /*   user: { */
      /*     ...session.user, */
      /*     username: token.username, */
      /*   } */
      /* } */
  /*     session.accessToken = token.accessToken; */
  /*     return session; */
  /*   }, */
  /*   async jwt({ token, user, account, profile, isNewUser }) { */
      /* if (user) { */
      /*   token.sub === account.access_token; */
      /* } */
      /* return token; */
      /* if (account) { */
      /*   token.accessToken === account.access_token; */
      /* } */
  /*     return token; */
  /*   }, */
  /* }, */
  secret: `${SECRET}`,
  jwt: {
    secret: `${SECRET}`,
    /* encode: , */
  },
  pages: {
    signIn: "/auth/sign-in",
    /* signOut: "/auth/sign-out", */
    /* error: "/auth/error", */
    /* newUser: "/auth/create-user", */
  },
};

export default NextAuth(authOptions);
