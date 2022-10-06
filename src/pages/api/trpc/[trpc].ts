import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/_app";
import { createContext } from "../../../server/context";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("Something Went Wrong", error);
    }
  },
  batching: {
    enabled: true,
  },
});
