import { z } from "zod";
import { db } from "@/db";
import { comments, commentReactions, playlistVideos, ReactionType, videoReactions, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, inArray, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { mux } from "@/lib/mux";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [video] = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.id, id)
          )
        );

      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return video;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
					...getTableColumns(videos),
					likeCount: db.$count(
						videoReactions,
						and(eq(videoReactions.type, ReactionType.LIKE), eq(videoReactions.videoId, videos.id))
					),
					viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
					commentCount: db.$count(
						comments,
						eq(comments.videoId, videos.id)
					),
				})
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
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

  // ✅ THIS IS THE FIX (SAVE BUTTON WORKS NOW)
  update: protectedProcedure
    .input(
      videoUpdateSchema.extend({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const { id: userId } = ctx.user;

      const result = await db
        .update(videos)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(videos.id, id),
            eq(videos.userId, userId)
          )
        )
        .returning();

      if (!result.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return result[0];
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const removedVideo = await db.transaction(async (tx) => {
        const [existingVideo] = await tx
          .select()
          .from(videos)
          .where(
            and(
              eq(videos.id, id),
              eq(videos.userId, userId)
            )
          );

        if (!existingVideo) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const videoComments = await tx
          .select({ id: comments.id })
          .from(comments)
          .where(eq(comments.videoId, id));
        const commentIds = videoComments.map((comment) => comment.id);

        if (commentIds.length > 0) {
          await tx.delete(commentReactions).where(inArray(commentReactions.commentId, commentIds));
          await tx.delete(comments).where(inArray(comments.id, commentIds));
        }

        await tx.delete(videoReactions).where(eq(videoReactions.videoId, id));
        await tx.delete(videoViews).where(eq(videoViews.videoId, id));
        await tx.delete(playlistVideos).where(eq(playlistVideos.videoId, id));
        await tx.delete(videos).where(eq(videos.id, id));

        return existingVideo;
      });

      const utapi = new UTApi();

      try {
        if (removedVideo.thumbnailKey) {
          await utapi.deleteFiles(removedVideo.thumbnailKey);
        }

        if (removedVideo.previewKey) {
          await utapi.deleteFiles(removedVideo.previewKey);
        }

        if (removedVideo.muxAssetId) {
          await mux.video.assets.delete(removedVideo.muxAssetId);
        }
      } catch (error) {
        console.error("Video was deleted, but external asset cleanup failed", error);
      }

      return removedVideo;
    }),
});
