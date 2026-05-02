import { db } from "@/db";
import { commentReactions, comments, users, videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { contextProps } from "@trpc/react-query/shared";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or, aliasedTable } from "drizzle-orm";
import { z } from "zod";

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
        parentId: z.string().uuid().nullish(),
        videoId: z.string().uuid(),
        value: z.string(),
    }))
    .mutation(async ({ctx, input})=>{
        const {parentId, videoId, value} = input;
        const {id: userId} = ctx.user;

        const [existingComment] = await db
         .select()
         .from(comments)
         .where(inArray(comments.id, parentId ? [parentId] : []))

         if (!existingComment && parentId){
          throw new TRPCError({code: "NOT_FOUND"})
         }
         
         if (existingComment?.parentId && parentId){
          throw new TRPCError({code: "BAD_REQUEST"})
         }
        const [createdcomments] = await db
        .insert(comments)
        .values({ userId,videoId, parentId, value})
        .returning();
        
        return createdcomments;
    }),
    getMany: baseProcedure
  .input(
    z.object({
      videoId: z.string().uuid(),
      parentId: z.string().uuid().nullish(),
      cursor: z.object({
        id: z.string().uuid(),
        updatedAt: z.date(),
      }).nullish(),
      limit: z.number().min(1).max(100),
    }),
  )
  .query(async ({ input , ctx}) => {
    const {clerkUserId} = ctx
    const {parentId , videoId, cursor,limit } = input;

    let userId;

    const [user] = await db
    .select()
    .from(users)
    .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

    if (user){
      userId = user.id;
    }

    const [videoInfo] = await db
      .select({ user: users })
      .from(videos)
      .innerJoin(users, eq(videos.userId, users.id))
      .where(eq(videos.id, videoId));

    if (!videoInfo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    const videoOwner = videoInfo.user;

    const viewerReactions = db.$with("viewer_reactions").as(
      db
        .select({
          commentId: commentReactions.commentId,
          type: commentReactions.type,
        })
        .from(commentReactions)
        .where(inArray(commentReactions.userId, userId ? [userId] : []))
    );

    const uploaderReactions = db.$with("uploader_reactions").as(
      db
        .select({
          commentId: commentReactions.commentId,
          type: commentReactions.type,
        })
        .from(commentReactions)
        .where(eq(commentReactions.userId, videoOwner.id))
    );

    const replies = db.$with("replies").as(
      db
      .select({
        parentId: comments.parentId,
        count: count(comments.id).as("count"),
      })
      .from(comments)
      .where(isNotNull(comments.parentId))
      .groupBy(comments.parentId),
    );

    const uploaderLikedReplies = db.$with("uploader_liked_replies").as(
      db
        .select({
          parentId: comments.parentId,
        })
        .from(comments)
        .innerJoin(commentReactions, and(
          eq(commentReactions.commentId, comments.id),
          eq(commentReactions.userId, videoOwner.id),
          eq(commentReactions.type, "like")
        ))
        .where(isNotNull(comments.parentId))
        .groupBy(comments.parentId)
    );

    const [totalData, data] = await Promise.all([
       db
     .select({
      count: count(),
     })
     .from(comments)
     .where(and(
      eq(comments.videoId, videoId),
      //isNull(comments.parentId),
    )),
      db
      .with(viewerReactions, replies, uploaderReactions, uploaderLikedReplies)
      .select({
        ...getTableColumns(comments),
        user: users,
        viewerReaction: viewerReactions.type,
        uploaderReaction: uploaderReactions.type,
        replyCount: replies.count,
        uploaderLikedRepliesId: uploaderLikedReplies.parentId,
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
      .where(
        and(
        eq(comments.videoId, videoId),
        parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
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
      .leftJoin(uploaderReactions, eq(uploaderReactions.commentId, comments.id))
      .leftJoin(replies, eq(comments.id, replies.parentId))
      .leftJoin(uploaderLikedReplies, eq(comments.id, uploaderLikedReplies.parentId))
      .orderBy(desc(comments.updatedAt), desc(comments.id)) 
      .limit(limit + 1)
    ])


       const hasMore = data.length > limit;
      const rawItems = hasMore ? data.slice(0, -1) : data;

      const items = rawItems.map((item) => ({
        ...item,
        videoOwner,
      }));

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
