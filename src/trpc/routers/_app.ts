import { z } from 'zod';
import { baseprocedure, createTRPCrouter } from '../init';

export const appRouter = createTRPCrouter({
  hello: baseprocedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
       console.log({ fromContext: opts.ctx.clerkUserId });

      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;