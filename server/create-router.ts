import { context } from "./context";
import * as trpc from "@trpc/server";

export const createRouter = () => {
  return trpc.router<context>();
}
