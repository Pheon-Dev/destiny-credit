import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../server/_app';

export const trpc = createReactQueryHooks<AppRouter>();
