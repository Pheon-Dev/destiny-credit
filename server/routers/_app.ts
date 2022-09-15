import { createRouter } from "../create-router";
import superjson from "superjson";
import { transactionsRouter } from "./transactions";
import { membersRouter } from "./members";
import { productsRouter } from "./products";
import { loansRouter } from "./loans";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("transactions.", transactionsRouter)
  .merge("loans.", loansRouter)
  .merge("members.", membersRouter)
  .merge("products.", productsRouter)

export type AppRouter = typeof appRouter;
