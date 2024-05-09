import { createTRPCRouter } from '@server/trpc';
import { authRouter } from './auth';
import { contributionRouter } from './contributions';
import { userRouter } from './user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
  contributions: contributionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
