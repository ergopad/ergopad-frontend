import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from "superjson";
import type { AppRouter } from '../server/routers/_app';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  if (process.env.VERCEL_URL !== "" || process.env.VERCEL_URL !== undefined)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  return `${process.env.AUTH_DOMAIN}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [httpBatchLink({
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         **/
        url: `${getBaseUrl()}/api/trpc`,
      })],
      headers() {
        if (ctx?.req) {
          return { ...ctx.req.headers }
        }
        else return {}
      }
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});