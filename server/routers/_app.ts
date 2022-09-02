import { createRouter } from '../createRouter';
import { paymentRouter } from './payment';
import superjson from 'superjson';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('post.', paymentRouter);

export type AppRouter = typeof appRouter;
