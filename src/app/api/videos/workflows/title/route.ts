import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import OpenAI from "openai";
import { mux } from "@/lib/mux";

interface InputType {
  userId: string;
  videoId: string;
}


const getReadyTextTrack = (
  tracks?: Array<{ id?: string | null; type?: string | null; status?: string | null; text_type?: string | null }> | null
) => {
  return tracks?.find(
    (track) =>
      track.type === "text" &&
      track.status === "ready" &&
      (!track.text_type || track.text_type === "subtitles" || track.text_type === "captions")
  );
};

const TITLE_SYSTEM_PROMPT = `Your task is to generate a compelling, SEO-focused YouTube title based on the video's transcript. Follow these rules strictly:
- **Engaging & Clickable:** The title must be catchy and spark curiosity.
- **Benefit-Oriented:** Focus on what the viewer will learn or gain.
- **Keyword-Rich:** Naturally include relevant keywords for search.
- **Concise:** 3 to 8 words, under 100 characters.
- **Highlight Uniqueness:** Emphasize the most interesting part of the video.
- **Plain Text Only:** Return ONLY the title text, with no quotes or extra formatting.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  // ✅ Get Video
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    let muxPlaybackId = video.muxPlaybackId;
    let muxTrackId = video.muxTrackId;

    if ((!muxPlaybackId || !muxTrackId) && video.muxUploadId) {
      const upload = await mux.video.uploads.retrieve(video.muxUploadId);

      if (upload.asset_id) {
        const asset = await mux.video.assets.retrieve(upload.asset_id);
        const readyTrack = getReadyTextTrack(asset.tracks);
        muxPlaybackId = muxPlaybackId ?? asset.playback_ids?.[0]?.id ?? null;
        muxTrackId = readyTrack?.id ?? null;

        await db
          .update(videos)
          .set({
            muxAssetId: asset.id,
            muxPlaybackId,
            muxStatus: asset.status,
            muxTrackId,
            muxTrackStatus: readyTrack?.status,
            updatedAt: new Date(),
          })
          .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
      }
    }

    if (!muxPlaybackId || !muxTrackId) {
        throw new Error("No subtitles are available for this video yet.");
    }
    const trackUrl = `https://stream.mux.com/${muxPlaybackId}/text/${muxTrackId}.txt`;
    const response = await fetch(trackUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transcript: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();

    if (!text) {
      throw new Error("Transcript is empty or could not be retrieved.");
    }

    return text;
  });

  // ✅ OpenRouter Init
  const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  // ✅ Generate Title
  const result = await openrouter.chat.completions.create({
    model: "bytedance-seed/seed-2.0-mini",
    messages: [
        { role: "system", content: TITLE_SYSTEM_PROMPT },
        { role: "user", content: transcript },
    ],
  });
  const title = result.choices[0].message.content?.trim();

  if (!title) {
    throw new Error("Generated title is empty.");
  }

  // ✅ Update DB
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        title: title || video.title,
        updatedAt: new Date(),
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});