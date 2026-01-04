import { initTRPC } from '@trpc/server';
import {cache} from "react";
export const createTRPCContext = cache(async() => {
    return {userId: "user_123"};
})
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({

});
// Base router and procedure helpers
export const createTRPCrouter = t.router;
export const createCallerFactory  = t.createCallerFactory;
export const baseprocedure = t.procedure;