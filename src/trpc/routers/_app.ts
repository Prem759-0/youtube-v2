import { z } from 'zod';
import { baseprocedure, createTRPCrouter } from '../init';
import { TRPCError } from '@trpc/server';
export const appRouter = createTRPCrouter({
  hello: baseprocedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {

      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;