import { db } from "@/db";
import {     commentReactions,comments, users } from "@/db/schema";
import { baseProcedure,createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { contextProps } from "@trpc/react-query/shared";
import { TRPCError } from "@trpc/server";
import { and ,count,desc, eq, getTableColumns, inArray, lt, or } from "drizzle-orm";
import {z} from "zod";

export const commentsRouter = createTRPCRouter({
    remove: protectedProcedure
    .input(z.object({
        id: z.string().uuid(),
    }))
    .mutation(async ({ctx, input})=>{
        const {id} = input;
        const {id: userId} = ctx.user;

         
        const [deletedComment] = await db
        .delete(comments)
        .where(and(
          eq(comments.id, id),
          eq(comments.userId, userId),
        ))
        .returning();

        if (!deletedComment){
          throw new TRPCError({code: "NOT_FOUND"})
        }
        
        return deletedComment;
    }),
    create: protectedProcedure
    .input(z.object({
        videoId: z.string().uuid(),
        value: z.string(),
    }))
    .mutation(async ({ctx, input})=>{
        const {videoId, value} = input;
        const {id: userId} = ctx.user;

         
        const [createdcomments] = await db
        .insert(comments)
        .values({ userId,videoId, value})
        .returning();
        
        return createdcomments;
    }),
    getMany: baseProcedure
  .input(
    z.object({
      videoId: z.string().uuid(),
      cursor: z.object({
        id: z.string().uuid(),
        updatedAt: z.date(),
      }).nullish(),
      limit: z.number().min(1).max(100),
    }),
  )
  .query(async ({ input , ctx}) => {
    const {clerkUserId} = ctx
    const { videoId, cursor,limit } = input;

    let userId;

    const [user] = await db
    .select()
    .from(users)
    .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

    if (user){
      userId = user.id;
    }

    const viewerReactions = db.$with("viewer_reactions").as(
      db
        .select({
          commentId: commentReactions.commentId,
          type: commentReactions.type,
        })
        .from(commentReactions)
        .where(inArray(commentReactions.userId, userId ? [userId] : []))
    );

    const [totalData, data] = await Promise.all([
       db
     .select({
      count: count(),
     })
     .from(comments)
     .where(eq(comments.videoId, videoId)),
      db
      .with(viewerReactions)
      .select({
        ...getTableColumns(comments),
        user: users,
        viewerReaction: viewerReactions.type,
        likeCount: db.$count(
             commentReactions,
             and(
              eq(commentReactions.type, "like"),
              eq(commentReactions.commentId, comments.id),
             )
        ),
        dislikeCount: db.$count(
          commentReactions,
          and(
            eq(commentReactions.type, "dislike"),
            eq(commentReactions.commentId, comments.id),
          )
        )
        
      })
      .from(comments)
      .where(and(
        eq(comments.videoId, videoId),
        cursor
        ? or(
          lt(comments.updatedAt, cursor.updatedAt),
          and(
            eq(comments.updatedAt, cursor.updatedAt),
            lt(comments.id, cursor.id)
          )
        )
        : undefined,
      ))
      .innerJoin(users, eq(comments.userId, users.id))
      .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
      .orderBy(desc(comments.updatedAt), desc(comments.id)) 
      .limit(limit + 1)
    ])


       const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
        : null;

      return {
        totalCount: totalData[0].count,
        items,
        nextCursor,
      };
    }),
  })
