import { initTRPC, TRPCError } from '@trpc/server';
import {cache} from "react";
import { auth } from '@clerk/nextjs/server';
import superjson from "superjson";

export const createTRPCContext = cache(async() => {
    const {userId} = await auth();

    return {clerkUserId: userId}
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
   transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory  = t.createCallerFactory;
export const baseprocedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts){
    const {ctx} = opts;

    if (!ctx.clerkUserId){
        throw new TRPCError({code: "UNAUTHORIZED"});
    }

    return opts.next({
        ctx:{
            ...ctx,
        }
    })
});