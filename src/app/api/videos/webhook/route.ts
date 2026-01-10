import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not set");
  }

  const headersList = await headers();
  const muxSignature = headersList.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature", { status: 401 });
  }

  const body = await request.text();

  try {
    mux.webhooks.verifySignature(
      body,
      { "mux-signature": muxSignature },
      SIGNING_SECRET
    );
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(body);
  console.log("Webhook received:", payload.type);

  switch (payload.type) {
    case "video.asset.created": {
      const data = payload.data;

      if (!data.upload_id) {
        console.log("No upload_id in video.asset.created");
        break;
      }

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      console.log("Updated video asset ID for upload:", data.upload_id);
      break;
    }

    case "video.asset.ready": {
      const data = payload.data;
      console.log("Processing video.asset.ready for asset:", data.id);

      if (!data.upload_id) {
        console.log("Missing upload_id in video.asset.ready payload");
        break;
      }

      // ✅ FIX: find PUBLIC playback ID
      const playback = data.playback_ids?.find(
        (p: any) => p.policy === "public"
      );

      if (!playback?.id) {
        console.log("No public playback ID found");
        break;
      }

      const thumbnailUrl = `https://image.mux.com/${playback.id}/thumbnail.jpg`;
      const previewUrl = `https://image.mux.com/${playback.id}/animated.gif`;

      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxPlaybackId: playback.id,
          muxStatus: "ready",
          thumbnailUrl,
          previewUrl,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      console.log("Successfully updated video metadata and thumbnail");
      break;
    }
  }

  return new Response("OK", { status: 200 });
};
