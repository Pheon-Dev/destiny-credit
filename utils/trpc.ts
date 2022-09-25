import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { NextPageContext } from "next";
import superjson from "superjson";
import type { AppRouter } from "../server/_app";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export interface SSRContext extends NextPageContext {
  status?: number;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: true,
  responseMeta({ clientErrors, ctx }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

    return {
      "Cache-Control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },

  /* responseMeta(opts) { */
  /*   const ctx = opts.ctx as SSRContext; */
  /**/
  /*   if (ctx.status) { */
  /*     return { */
  /*       status: ctx.status, */
  /*     }; */
  /*   } */
  /**/
  /*   const error = opts.clientErrors[0]; */
  /*   if (error) { */
  /*     return { */
  /*       status: error.data?.httpStatus ?? 500, */
  /*     }; */
  /*   } */
  /**/
  /*   return {}; */
  /* }, */
});
