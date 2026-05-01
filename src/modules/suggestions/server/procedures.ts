import { z } from "zod";
import { db } from "@/db";
import { videos, videoViews, videoReactions, videoUpdateSchema, users } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const suggestionsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({input }) => {
      const { videoId, cursor, limit } = input;

      const [existingVideo] = await db
       .select()
       .from(videos)
       .where(eq(videos.id, videoId));

       if(!existingVideo){
        throw new TRPCError({ code: "NOT_FOUND" });
       }

      const data = await db
        .select({
          ...getTableColumns(videos),
          user:users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(videoReactions, 
            and(
              eq(videoReactions.videoId, videos.id), 
              eq(videoReactions.type, "like"),
            )
          ),
          dislikeCount: db.$count(videoReactions, 
            and(
              eq(videoReactions.videoId, videos.id), 
              eq(videoReactions.type, "dislike"),
            )
          ),

        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            existingVideo.categoryId
            ? eq(videos.categoryId, existingVideo.categoryId)
            : undefined,
            cursor
              ? or(
                lt(videos.updatedAt, cursor.updatedAt),
                and(
                  eq(videos.updatedAt, cursor.updatedAt),
                  lt(videos.id, cursor.id)
                )
              )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

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
        items,
        nextCursor,
      };
    }),
});
