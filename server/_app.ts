import { createRouter } from "./create-router";
import superjson from "superjson";
import {
  transactionsRouter,
  membersRouter,
  productsRouter,
  loansRouter,
  usersRouter,
} from "./routers";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("transactions.", transactionsRouter)
  .merge("loans.", loansRouter)
  .merge("users.", usersRouter)
  .merge("members.", membersRouter)
  .merge("products.", productsRouter)

export type AppRouter = typeof appRouter;
