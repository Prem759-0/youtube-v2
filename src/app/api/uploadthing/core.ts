import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import {auth} from "@clerk/nextjs/server"
import z from "zod";
import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  	bannerUploader: f({
		image: {
			maxFileCount: 1,
			maxFileSize: '4MB',
			minFileCount: 1,
		},
	})
		.middleware(async () => {
			const { userId: clerkUserId } = await auth();

			if (!clerkUserId) throw new UploadThingError({ code: 'FORBIDDEN' });

			const [user] = await db
				.select({ bannerKey: users.bannerKey, id: users.id })
				.from(users)
				.where(eq(users.clerkId, clerkUserId));
			if (!user) throw new UploadThingError({ code: 'FORBIDDEN' });

			if (user.bannerKey) {
				const utapi = new UTApi();

				await utapi.deleteFiles(user.bannerKey);
				await db.update(users).set({ bannerKey: null, bannerUrl: null }).where(eq(users.id, user.id));
			}

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			await db.update(users).set({ bannerKey: file.key, bannerUrl: file.ufsUrl }).where(eq(users.id, metadata.userId));

			return { uploadedBy: metadata.userId };
		}),
    
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({
      videoId: z.string().uuid(),
    }))

    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUserId))

      if (!user) throw new UploadThingError("Unauthorized")

        const [existingVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
        })
        .from(videos)
        .where(and(
          eq(videos.id, input.videoId),
          eq(videos.userId, user.id)
        ))

        if (!existingVideo) throw new UploadThingError("Not Found")

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
              eq(videos.id, input.videoId),
              eq(videos.userId, user.id)
            ))
          }


      return { user, ...input};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.user);
      console.log("file url", file.ufsUrl);
      await db
       .update(videos)
       .set({ 
        thumbnailUrl: file.ufsUrl,
        thumbnailKey: file.key,
        })
       .where(and(
        eq(videos.id, metadata.videoId),
        eq(videos.userId, metadata.user.id)
      ))

     return {uploadedBy: metadata.user.id};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
