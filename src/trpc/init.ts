import { initTRPC } from '@trpc/server';
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
export const createTRPCrouter = t.router;
export const createCallerFactory  = t.createCallerFactory;
export const baseprocedure = t.procedure;