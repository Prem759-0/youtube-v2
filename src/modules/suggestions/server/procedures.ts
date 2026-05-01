import { z } from "zod";
import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";
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
        .select()
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

      const result = await db
        .delete(videos)
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
});
