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
      try {
        return await prisma.user.findMany();
      } catch (error) {
        console.log("users.users");
      }
    },
  })
  .query("user", {
    input: z.object({
      email: z.string().email(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.user.findFirst({
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
      } catch (error) {
        console.log("users.user");
      }
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
      try {
        return await prisma.user.create({
          data: {
            username: input.username,
            password: input.password,
            email: input.email,
            role: input.role,
          },
        });
      } catch (error) {
        console.log("users.create-user");
      }
    },
  });

