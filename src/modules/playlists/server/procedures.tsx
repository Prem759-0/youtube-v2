import { z } from "zod";
import { db } from "@/db";
import { and, desc, eq, getTableColumns,  lt, or } from "drizzle-orm"
import {users, videos,  videoReactions, playlists, playlistVideos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const playlistsRouter = createTRPCRouter({
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
    .query(async ({  input, ctx }) => {
      const {id: userId} = ctx.user;
      const { cursor, limit} = input;

  

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users,
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .leftJoin(
          playlistVideos,
          eq(playlistVideos.playlistId, playlists.id)
        )
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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


  create: protectedProcedure
  .input(z.object({name:z.string().min(1)}))
  .mutation(async ({input, ctx}) => {
    const {name} = input;
    const {id: userId} = ctx.user;

    const [createdPlaylist] = await db
      .insert(playlists)
      .values({
        userId,
        name,
      })
      .returning()

      if(!createdPlaylist){
        throw new TRPCError({code: "BAD_REQUEST"})
      }

    return createdPlaylist;
  }),

  getLiked: protectedProcedure
    .input(
      z.object({
       
        cursor: z
          .object({
            id: z.string().uuid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({  input, ctx }) => {
      const {id: userId} = ctx.user;
      const { cursor, limit} = input;

      const viewerVideoReactions = db.$with("viewer_video_reactions").as(
        db
        .select({
          videoId: videoReactions.videoId,
          likedAt: videoReactions.updatedAt,
        })
        .from(videoReactions)
        .where(and(
          eq(videoReactions.userId, userId),
          eq(videoReactions.type, "like"),
        ))
      );

      const data = await db
      .with(viewerVideoReactions)
        .select({
           ...getTableColumns(videos),
           user: users,
           likedAt: viewerVideoReactions.likedAt,
            viewCount: db.$count(videoReactions, eq(videoReactions.videoId, videos.id)),
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
        .innerJoin(viewerVideoReactions, eq(videos.id, viewerVideoReactions.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                lt(viewerVideoReactions.likedAt, cursor.likedAt),
                and(
                  eq(viewerVideoReactions.likedAt, cursor.likedAt),
                  lt(videos.id, cursor.id)
                )
              )
              : undefined
          )
        )
        .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
          id: lastItem.id,
          likedAt: lastItem.likedAt,
        }
        : null;

      return {
        items,
        nextCursor,
      };
    }),


   getHistory: protectedProcedure
    .input(
      z.object({
       
        cursor: z
          .object({
            id: z.string().uuid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({  input, ctx }) => {
      const {id: userId} = ctx.user;
      const { cursor, limit} = input;

      const viewerVideoReactions = db.$with("viewer_video_views").as(
        db
        .select({
          videoId: videoReactions.videoId,
          likedAt: videoReactions.updatedAt,
        })
        .from(videoReactions)
        .where(eq(videoReactions.userId, userId))
      )

      const data = await db
      .with(viewerVideoReactions)
        .select({
           ...getTableColumns(videos),
           user: users,
           likedAt: viewerVideoReactions.likedAt,
            viewCount: db.$count(videoReactions, eq(videoReactions.videoId, videos.id)),
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
        .innerJoin(viewerVideoReactions, eq(videos.id, viewerVideoReactions.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                lt(viewerVideoReactions.likedAt, cursor.likedAt),
                and(
                  eq(viewerVideoReactions.likedAt, cursor.likedAt),
                  lt(videos.id, cursor.id)
                )
              )
              : undefined
          )
        )
        .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
          id: lastItem.id,
          likedAt: lastItem.likedAt,
        }
        : null;

      return {
        items,
        nextCursor,
      };
    }),

});


