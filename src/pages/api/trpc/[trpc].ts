import { appRouter } from '@server/routers/_app'
import { createTRPCContext } from '@server/trpc'
import * as trpcNext from '@trpc/server/adapters/next'

// export API handler
// @see https://trpc.io/docs/server/adapters
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error }) => {
    console.error(error)
  },
})
