import { z } from "zod";
import { db } from "@/db";
import { and, eq } from "drizzle-orm"
import { videos, videoUpdateSchema } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";

export const videosRouter = createTRPCRouter({

  generateThumbnail: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ctx,input})=>{
    const {id:userId} = ctx.user;

    const {workflowRunId } = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
      body:{userId, videoId: input.id},
    });

    return workflowRunId;
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

       const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
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
              { language_code: "es", name: "Spanish" },
              { language_code: "fr", name: "French" },
              { language_code: "de", name: "German" },
              { language_code: "it", name: "Italian" },
              { language_code: "pt", name: "Portuguese" },
              { language_code: "ru", name: "Russian" },
              { language_code: "pl", name: "Polish" },
              { language_code: "nl", name: "Dutch" },
              { language_code: "ca", name: "Catalan" },
              { language_code: "tr", name: "Turkish" },
              { language_code: "sv", name: "Swedish" },
              { language_code: "uk", name: "Ukrainian" },
              { language_code: "no", name: "Norwegian" },
              { language_code: "fi", name: "Finnish" },
              { language_code: "sk", name: "Slovak" },
              { language_code: "el", name: "Greek" },
              { language_code: "cs", name: "Czech" },
              { language_code: "hr", name: "Croatian" },
              { language_code: "da", name: "Danish" },
              { language_code: "ro", name: "Romanian" },
              { language_code: "bg", name: "Bulgarian" },
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
