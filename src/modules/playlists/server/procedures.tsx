import { z } from "zod";
import { db } from "@/db";
import { and, desc, eq, getTableColumns,  inArray,  lt, or, sql } from "drizzle-orm"
import {users, videos,  videoReactions, playlists, playlistVideos, videoViews, videoVisibility, reactionType ,ReactionType} from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { playlistCreateSchema } from "../schemas/playlist-create-schema";

export const playlistsRouter = createTRPCRouter({
  getOne: baseProcedure.input(z.object({ id: z.uuid() })).query(async ({ input }) => {
		const { id } = input;

		const [playlist] = await db
			.select({
				...getTableColumns(playlists),
				user: users,
			})
			.from(playlists)
			.innerJoin(users, eq(playlists.userId, users.id))
			.where(eq(playlists.id, id));

		if (!playlist) throw new TRPCError({ code: 'NOT_FOUND', message: 'Playlist not found!' });

		return playlist;
	}),

  	getVideos: baseProcedure
		.input(
			z.object({
				cursor: z
					.object({
						id: z.uuid(),
						updatedAt: z.date(),
					})
					.nullish(),
				limit: z.number().min(1).max(100),
				playlistId: z.uuid(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { clerkUserId } = ctx;
			const { cursor, limit, playlistId } = input;

			const [existingPlaylist] = await db
				.select({ userId: playlists.userId })
				.from(playlists)
				.where(eq(playlists.id, playlistId));

			if (!existingPlaylist) throw new TRPCError({ code: 'NOT_FOUND', message: 'Playlist not found!' });

			let currentUserId: string | undefined;

			const [user] = await db
				.select({ id: users.id })
				.from(users)
				.where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

			if (user) currentUserId = user.id;

			const videosFromPlaylist = db.$with('playlist_videos').as(
				db
					.select({
						videoId: playlistVideos.videoId,
					})
					.from(playlistVideos)
					.where(eq(playlistVideos.playlistId, playlistId))
			);

			const data = await db
				.with(videosFromPlaylist)
				.select({
					...getTableColumns(videos),
					dislikeCount: db.$count(
						videoReactions,
						and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, ReactionType.DISLIKE))
					),
					likeCount: db.$count(
						videoReactions,
						and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, reactionType.LIKE))
					),
					user: users,
					viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
				})
				.from(videos)
				.innerJoin(users, eq(videos.userId, users.id))
				.innerJoin(videosFromPlaylist, eq(videos.id, videosFromPlaylist.videoId))
				.where(
					and(
						or(
							eq(videos.visibility, videoVisibility.PUBLIC), 
							currentUserId ? eq(videos.userId, currentUserId) : undefined
						),
						cursor
							? or(
									lt(videos.updatedAt, cursor.updatedAt),
									and(eq(videos.updatedAt, cursor.updatedAt), lt(videos.id, cursor.id))
								)
							: undefined
					)
				)
				.orderBy(desc(videos.updatedAt), desc(videos.id))
				// Add 1 to the limit to check if there is more data
				.limit(limit + 1);

			const hasMore = data.length > limit;
			// Remove the last item if there is more data
			const items = hasMore ? data.slice(0, -1) : data;
			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null;

			return {
				items,
				nextCursor,
			};
		}),

    remove: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
		const { id } = input;
		const { id: userId } = ctx.user;

		const [deletedPLaylist] = await db
			.delete(playlists)
			.where(and(eq(playlists.id, id), eq(playlists.userId, userId)))
			.returning();

		if (!deletedPLaylist) throw new TRPCError({ code: 'NOT_FOUND', message: 'Playlist not found!' });

		return deletedPLaylist;
	}),

  removeVideo: protectedProcedure
		.input(
			z.object({
				playlistId: z.uuid(),
				videoId: z.uuid(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { playlistId, videoId } = input;
			const { id: userId } = ctx.user;

			const existingPlaylistCount = await db.$count(
				playlists,
				and(eq(playlists.id, playlistId), eq(playlists.userId, userId))
			);

			if (!existingPlaylistCount) throw new TRPCError({ code: 'NOT_FOUND', message: 'Playlist not found!' });

			const existingVideoCount = await db.$count(videos, eq(videos.id, videoId));

			if (!existingVideoCount) throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found!' });

			const [existingPlaylistVideo] = await db
				.select()
				.from(playlistVideos)
				.where(and(eq(playlistVideos.playlistId, playlistId), eq(playlistVideos.videoId, videoId)));

			if (!existingPlaylistVideo) throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found in playlist!' });

			const [deletedPlaylistVideo] = await db
				.delete(playlistVideos)
				.where(and(eq(playlistVideos.playlistId, playlistId), eq(playlistVideos.videoId, videoId)))
				.returning();

			return deletedPlaylistVideo;
		}),

   addVideo: protectedProcedure
		.input(
			z.object({
				playlistId: z.uuid(),
				videoId: z.uuid(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { playlistId, videoId } = input;
			const { id: userId } = ctx.user;

			const existingPlaylistCount = await db.$count(
				playlists,
				and(eq(playlists.id, playlistId), eq(playlists.userId, userId))
			);

			if (!existingPlaylistCount) throw new TRPCError({ code: 'NOT_FOUND', message: 'Playlist not found!' });

			const existingVideoCount = await db.$count(videos, eq(videos.id, videoId));

			if (!existingVideoCount) throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found!' });

			const [existingPlaylistVideo] = await db
				.select()
				.from(playlistVideos)
				.where(and(eq(playlistVideos.playlistId, playlistId), eq(playlistVideos.videoId, videoId)));

			if (existingPlaylistVideo) throw new TRPCError({ code: 'CONFLICT', message: 'Video already added to playlist!' });

			const [createdPlaylistVideo] = await db.insert(playlistVideos).values({ playlistId, videoId }).returning();

			return createdPlaylistVideo;
		}),

    	create: protectedProcedure.input(playlistCreateSchema).mutation(async ({ ctx, input }) => {
		const { name } = input;
		const { id: userId } = ctx.user;

		const [playlist] = await db
			.insert(playlists)
			.values({
				name,
				userId,
			})
			.returning();

		if (!playlist) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Failed to create playlist!' });

		return playlist;
	}),
	

  getManyForVideo: protectedProcedure
		.input(
			z.object({
				cursor: z
					.object({
						id: z.uuid(),
						updatedAt: z.date(),
					})
					.nullish(),
				limit: z.number().min(1).max(100),
				videoId: z.uuid(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;
			const { cursor, limit, videoId } = input;

			const data = await db
				.select({
					...getTableColumns(playlists),
					containsVideo: sql`EXISTS (${db
						.select({ n: sql`1` })
						.from(playlistVideos)
						.where(and(
              eq(playlistVideos.playlistId, playlists.id),
             eq(playlistVideos.videoId, videoId)
             ))
             })`.as(
						'contains_video'
					),
					videoCount: db.$count(
            playlistVideos, 
            eq(
              playlists.id, 
              playlistVideos.playlistId
            )),
				})
				.from(playlists)
				.where(
					and(
						eq(playlists.userId, userId),
						cursor
							? or(
									lt(playlists.updatedAt, cursor.updatedAt),
									and(eq(playlists.updatedAt, cursor.updatedAt), lt(playlists.id, cursor.id))
								)
							: undefined
					)
				)
				.orderBy(desc(playlists.updatedAt), desc(playlists.id))
				// Add 1 to the limit to check if there is more data
				.limit(limit + 1);

			const hasMore = data.length > limit;
			// Remove the last item if there is more data
			const items = hasMore ? data.slice(0, -1) : data;
			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null;

			return {
				items,
				nextCursor,
			};
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
         thumbnailUrl: sql<string | null>`(
						SELECT v.thumbnail_url
						FROM ${playlistVideos} pv
						JOIN ${videos} v ON v.id = pv.video_id
						WHERE pv.playlist_id = ${playlists.id} AND
						v.visibility = 'public'
						ORDER BY pv.updated_at DESC
						LIMIT 1
					)`,
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


