import { createRouter } from "./create-router";
import {
  transactionsRouter,
  membersRouter,
  productsRouter,
  loansRouter,
} from "./routers";

export const appRouter = createRouter()
  /* .transformer(superjson) */
  .merge("transactions.", transactionsRouter)
  .merge("loans.", loansRouter)
  .merge("members.", membersRouter)
  .merge("products.", productsRouter)

export type AppRouter = typeof appRouter;
