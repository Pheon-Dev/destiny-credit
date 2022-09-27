import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  state: true,
});

export const usersRouter = t.router({
  users: t.procedure.query(async () => {
    const users = await prisma.user.findMany({
      select: defaultUserSelect,
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!users) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `users.users not found`,
      });
    }
    return users;
  }),
  officers: t.procedure.query(async () => {
    const user = await prisma.user.findMany({
      where: {
        role: "CO",
      },
      select: defaultUserSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `users.user not found`,
      });
    }
    return user;
  }),
  user_id: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const user = await prisma.user.findFirst({
        where: {
          id: input.id,
        },
        select: defaultUserSelect,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.user_id not found`,
        });
      }
      return user;
    }),
  delete_all: t.procedure.query(async () => {
    const user = await prisma.verificationToken.deleteMany({
      where: {},
    });

    return user;
  }),
  user: t.procedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.email === "undefined")
        return await prisma.user.findFirst({ where: {} });
      if (input.email === "") return await prisma.user.findFirst({ where: {} });
      const user = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: defaultUserSelect,
      });

      if (user) {
        await prisma.user.updateMany({
          where: {
            email: input.email,
          },
          data: {
            state: "online",
          },
        });
      }

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.user not found`,
        });
      }
      return user;
    }),
  signout: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.updateMany({
        where: {
          id: input.id,
        },
        data: {
          state: "offline",
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.signout not found`,
        });
      }
      return user;
    }),
  create_user: t.procedure
    .input(
      z.object({
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        password: z.string(),
        email: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
          password: input.password,
          email: input.email,
          role: input.role,
          state: "offline",
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.create_user not found`,
        });
      }
      return user;
    }),
});
