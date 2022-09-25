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
        return {
          id: "",
          username: "",
          role: "",
          firstName: "",
          lastName: "",
          email: "",
        };
      if (input.email === "")
        return {
          id: "",
          username: "",
          role: "",
          firstName: "",
          lastName: "",
          email: "",
        };
      const user = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
        select: defaultUserSelect,
      });

      if (!user) {
        return;
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
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `users.create-user not found`,
        });
      }
      return user;
    }),
});
