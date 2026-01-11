import { z } from "zod";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"], // ✅ REQUIRED FOR THUMBNAIL//    
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
