import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
});

export const usersRouter = createRouter()
  .query("users", {
    resolve: async () => {
      const users = await prisma.user.findMany({
        select: defaultUserSelect,
      });
      if (!users) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.users not found`,
        });
      }
      return users;
    },
  })
  .query("officers", {
    resolve: async () => {
      const user = await prisma.user.findMany({
        where: {
          role: "CO",
        },
        select: defaultUserSelect,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.officers not found`,
        });
      }
      return user;
    },
  })
  .query("user-id", {
    input: z.object({
      id: z.string()
    }),
    resolve: async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: input.id,
        },
        select: defaultUserSelect,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.user-id not found`,
        });
      }
      return user;
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
        select: defaultUserSelect,
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
      firstName: z.string(),
      lastName: z.string(),
      password: z.string(),
      email: z.string(),
      role: z.string(),
    }),
    resolve: async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
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
