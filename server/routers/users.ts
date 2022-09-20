import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();
/* const defaultUsersSelect = Prisma.validator<Prisma.UserSelect>()({ */
/*   id: true, */
/*   createdAt: true, */
/*   updatedAt: true, */
/*   username: true, */
/* }); */

export const usersRouter = createRouter()
  .query("users", {
    resolve: async () => {
      const users = await prisma.user.findMany();
      if (!users) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.users not found`,
        });
      }
      return users;
    },
  })
  .query("user", {
    input: z.object({
      email: z.string().email(),
    }),
    resolve: async ({ input }) => {
      const user = await prisma.user.findFirst({
          where: {
            email: input.email,
          },
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.user not found`,
        });
      }
      return user;
    },
  })
  .mutation("create-user", {
    input: z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
      role: z.string(),
    }),
    resolve: async ({ input }) => {
      const user = await prisma.user.create({
          data: {
            username: input.username,
            password: input.password,
            email: input.email,
            role: input.role,
          },
        });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.create-user not found`,
        });
      }
      return user;
    },
  });

