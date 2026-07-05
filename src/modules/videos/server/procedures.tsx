import { z } from "zod";
import { db } from "@/db";
import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from "drizzle-orm"
import {users, videos, videoUpdateSchema, videoViews,videoReactions, subscriptions } from "@/db/schema";
import { baseProcedure,createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";

const MUX_IMAGE_BASE_URL = "https://image.mux.com";

const getPublicPlaybackId = (
  playbackIds?: Array<{ id?: string | null; policy?: string | null }> | null
) => {
  const publicPlaybackId = playbackIds?.find((playbackId) => playbackId.policy === "public")?.id;
  return publicPlaybackId ?? playbackIds?.[0]?.id ?? null;
};

const getReadyTextTrack = (
  tracks?: Array<{
    id?: string | null;
    type?: string | null;
    status?: string | null;
    text_type?: string | null;
  }> | null
) => {
  return tracks?.find(
    (track) =>
      track.type === "text" &&
      track.status === "ready" &&
      (!track.text_type || track.text_type === "subtitles" || track.text_type === "captions")
  );
};

export const updateVideoFromMuxUpload = async (uploadId: string) => {
  const upload = await mux.video.uploads.retrieve(uploadId);

  if (!upload?.asset_id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Mux asset id not found for this upload.",
    });
  }

  const asset = await mux.video.assets.retrieve(upload.asset_id);
  const playbackId = getPublicPlaybackId(asset.playback_ids);
  const textTrack = getReadyTextTrack(asset.tracks);
  const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;

  let thumbnailKey: string | null | undefined;
  let thumbnailUrl: string | null | undefined;
  let previewKey: string | null | undefined;
  let previewUrl: string | null | undefined;

  if (playbackId) {
    const utapi = new UTApi();
    const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
      `${MUX_IMAGE_BASE_URL}/${playbackId}/thumbnail.jpg`,
      `${MUX_IMAGE_BASE_URL}/${playbackId}/animated.gif`,
    ]);

    if (uploadedThumbnail.data) {
      thumbnailKey = uploadedThumbnail.data.key;
      thumbnailUrl = uploadedThumbnail.data.ufsUrl;
    }

    if (uploadedPreview.data) {
      previewKey = uploadedPreview.data.key;
      previewUrl = uploadedPreview.data.ufsUrl;
    }
  }

  const [updatedVideo] = await db
    .update(videos)
    .set({
      muxAssetId: asset.id,
      muxPlaybackId: playbackId,
      muxStatus: asset.status,
      muxTrackId: textTrack?.id,
      muxTrackStatus: textTrack?.status,
      thumbnailKey,
      thumbnailUrl,
      previewKey,
      previewUrl,
      duration,
      updatedAt: new Date(),
    })
    .where(eq(videos.muxUploadId, uploadId))
    .returning();

  if (!updatedVideo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Video not found for this Mux upload.",
    });
  }

  return updatedVideo;
};

export const videosRouter = createTRPCRouter({

  getManySubscribed: protectedProcedure
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
      const { cursor, limit } = input;

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db 
        .select({
          userId: subscriptions.creatorId,

        })
        .from(subscriptions)
        .where(eq(subscriptions.viewerId, userId))
      )

      const data = await db
        .with(viewerSubscriptions)
        .select({
           ...getTableColumns(videos),
           user: users,
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
        .innerJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.userId, users.id)
        )
        .where(
          and(
            eq(videos.visibility, "public"),
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


   getManyTrending: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewCount: z.number(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({  input }) => {
      const { cursor, limit } = input;

      const viewsCountSubquery = db.$count(
        videoViews,
        eq(videoViews.videoId, videos.id)
      )

      const data = await db
        .select({
           ...getTableColumns(videos),
           user: users,
            viewCount: viewsCountSubquery,
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
            eq(videos.visibility, "public"),
            cursor
              ? or(
                lt(viewsCountSubquery, cursor.viewCount),
                and(
                  eq(viewsCountSubquery, cursor.viewCount),
                  lt(videos.id, cursor.id)
                )
              )
              : undefined
          )
        )
        .orderBy(desc(viewsCountSubquery), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
          id: lastItem.id,
          viewCount: lastItem.viewCount,
        }
        : null;

      return {
        items,
        nextCursor,
      };
    }),


   getMany: baseProcedure
    .input(
      z.object({
       
        categoryId: z.string().uuid().nullish(),
        userId: z.string().uuid().nullish(),
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
      const { cursor, limit, categoryId , userId} = input;
      const { clerkUserId } = ctx;

      let currentUserId: string | undefined;

      const [currentUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (currentUser) {
        currentUserId = currentUser.id;
      }

      const isCurrentUser = !!userId && currentUserId === userId;

      const data = await db
        .select({
           ...getTableColumns(videos),
           user: users,
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
            !isCurrentUser ? eq(videos.visibility, "public") : undefined,
            userId ? eq(videos.userId, userId) : undefined,
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
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

  getOne: baseProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const {clerkUserId} = ctx;

    let userId;

    const [user] = await db
    .select()
    .from(users)
    .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

    if(user){
      userId = user.id;
    }

    const viewerReactions = db.$with("viewer_reactions").as(
      db
        .select({
          videoId: videoReactions.videoId,
          type: videoReactions.type,
        })
        .from(videoReactions)
        .where(inArray(videoReactions.userId, userId ? [userId] : []))
    );

    const viewerSubscriptions = db.$with("viewer_subscriptions").as(
      db
        .select()
        .from(subscriptions)
        .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
    )

     const [existingVideo] = await db
     .with(viewerReactions, viewerSubscriptions)
     .select({
      ...getTableColumns(videos),
      user:{
        ...getTableColumns(users),
        subscriberCount:db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
        viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
      },
      viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
      likeCount: db.$count(
        videoReactions,
        and(
          eq(videoReactions.videoId, videos.id),
          eq(videoReactions.type, "like"),
        ),
      ),
      dislikeCount: db.$count(
        videoReactions,
        and(
          eq(videoReactions.videoId, videos.id),
          eq(videoReactions.type, "dislike"),
        ),
      ),
      viewerReaction: viewerReactions.type,
     })
     .from(videos)
     .innerJoin(users, eq(videos.userId, users.id))
     .leftJoin(viewerReactions, eq(viewerReactions.videoId,  videos.id))
     .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId,  users.id))
     .where(eq(videos.id, input.id))
     //.groupBy(
     // videos.id,
     // users.id,
     // viewerReactions.type,
     //)

     if (!existingVideo){
      throw new TRPCError({code:"NOT_FOUND"})
     }
     return existingVideo;
  }),

  generateDescription: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ctx,input})=>{
    const {id:userId} = ctx.user;

    const {workflowRunId } = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
      body:{userId, videoId: input.id},
    });

    return workflowRunId;
  }),

  generateTitle: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ctx,input})=>{
    const {id:userId} = ctx.user;

    const {workflowRunId } = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
      body:{userId, videoId: input.id},
    });

    return workflowRunId;
  }),

  generateThumbnail: protectedProcedure
  .input(z.object({ id: z.string().uuid(), prompt: z.string().min(10)}))
  .mutation(async ({ctx,input})=>{
    const {id:userId} = ctx.user;

    const {workflowRunId } = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
      body:{userId, videoId: input.id, prompt: input.prompt},
    });

    return workflowRunId;
  }),

  revalidate: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ctx,input})=>{
    const {id:userId} = ctx.user;

     const [existingVideo] = await db
       .select()
       .from(videos)
       .where(and(
        eq(videos.id, input.id),
        eq(videos.userId, userId),
       ));

       if(!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" })
       }

       if (!existingVideo.muxUploadId){
        throw new TRPCError({code: "BAD_REQUEST"});
       }

       const upload = await mux.video.uploads.retrieve(
         existingVideo.muxUploadId
    
       )

       if(!upload || !upload.asset_id) {
        throw new TRPCError({code: "BAD_REQUEST"});
       }
    
       const asset = await mux.video.assets.retrieve(
        upload.asset_id
      )

      if(!asset){
        throw new TRPCError({code: "BAD_REQUEST"});
      }

      return updateVideoFromMuxUpload(existingVideo.muxUploadId);
  }),


  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      
      const [existingVideo] = await db
       .select()
       .from(videos)
       .where(and(
        eq(videos.id, input.id),
        eq(videos.userId, userId),
       ));

       if(!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" })
       }

       if (existingVideo.thumbnailKey){
         const utapi = new UTApi();
                    await utapi.deleteFiles(existingVideo.thumbnailKey);
                    await db.
                    update(videos)
                    .set({
                      thumbnailKey: null,
                      thumbnailUrl: null,
                    })
                    .where(and(
                      eq(videos.id, input.id),
                      eq(videos.userId, userId)
                    ))
       }

       if (!existingVideo.muxPlaybackId){
        throw new TRPCError({code: "BAD_REQUEST"});
       }
       const utapi = new UTApi();

       const tempThumbnailUrl = `${MUX_IMAGE_BASE_URL}/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
       const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

       if (!uploadedThumbnail.data){
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR"});

       }

       const {key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;


       const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl, thumbnailKey })
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId),
        ))
        .returning();

        if (!updatedVideo) {
          throw new TRPCError({ code: "NOT_FOUND" })
        }

        return updatedVideo;
    }),

  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],

        input: [
          {
            generated_subtitles: [
              { language_code: "en", name: "English" },
            ],
          },
        ],

      },
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video,
      url: upload.url,
    };
  }),
});

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await db.insert(videoViews).values({
          userId: ctx.user.id,
          videoId: input.videoId,
        });
      } catch (err: any) {
        if (err?.code !== "23505") {
          throw err;
        }
      }
    }),
});
