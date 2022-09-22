import { t } from "./trpc";
import {
  transactionsRouter,
  membersRouter,
  productsRouter,
  loansRouter,
  usersRouter,
  logsRouter,
} from "./routers";

export const appRouter = t.router({
  transactions: transactionsRouter,
  loans: loansRouter,
  users: usersRouter,
  members: membersRouter,
  products: productsRouter,
  logs: logsRouter,
});

export type AppRouter = typeof appRouter;
