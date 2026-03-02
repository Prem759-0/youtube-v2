import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import OpenAI from "openai";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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
    if (!video.muxPlaybackId || !video.muxTrackId) {
        throw new Error("Mux data not available for this video.");
    }
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
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

  // ✅ Generate DESCRIPTION
  const result = await openrouter.chat.completions.create({
    model: "bytedance-seed/seed-2.0-mini",
    messages: [
        { role: "system", content: DESCRIPTION_SYSTEM_PROMPT },
        { role: "user", content: transcript },
    ],
  });
  const description = result.choices[0]?.message.content;

  if (!description) {
    throw new Error("Generated description is empty.");
  }

  // ✅ Update DB
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        description: description || video.description,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});