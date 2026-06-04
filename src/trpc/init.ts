import { initTRPC, TRPCError } from '@trpc/server';
import {cache} from "react";
import { db } from '@/db';
import { auth, currentUser } from '@clerk/nextjs/server';
import superjson from "superjson";
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ratelimit } from '@/lib/ratelimit';

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
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts){
    const {ctx} = opts;

    if (!ctx.clerkUserId){
        throw new TRPCError({code: "UNAUTHORIZED"});
    }

    const [selectedUser] = await db
     .select()
     .from(users)
     .where(eq(users.clerkId, ctx.clerkUserId))
     .limit(1)

    let user = selectedUser;

    // Webhook timing/race: Clerk may have the user session before `users` row exists in DB.
    // Create a minimal placeholder user so protected actions don't fail with 401.
    if (!user){
        const clerkUser = await currentUser();
        let name = clerkUser ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() : "";
        if (name === "") {
            name = "User"; // Fallback name
        }

        await db.insert(users)
        .values({
            clerkId: ctx.clerkUserId,
            name,
            imageUrl: clerkUser?.imageUrl ?? "/user.jpg",
        })
        .onConflictDoUpdate({
            target: [users.clerkId],
            set: {
                name,
                imageUrl: clerkUser?.imageUrl ?? "/user.jpg",
                updatedAt: new Date(),
            }
        });

        const [freshUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, ctx.clerkUserId))
        .limit(1);

        if (!freshUser){
            throw new TRPCError({code: "UNAUTHORIZED"});
        }

        user = freshUser;
     }

     const {success} = await ratelimit.limit(user.id);

     if(!success){
        throw new TRPCError({code: "TOO_MANY_REQUESTS"})
     }

    return opts.next({
        ctx:{
            ...ctx,
            user,
        }
    })
});