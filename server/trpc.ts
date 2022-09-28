import { Context } from "./context";
import { initTRPC } from "@trpc/server";
import { transformer } from "../utils/trpc";

export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape;
  },
});
