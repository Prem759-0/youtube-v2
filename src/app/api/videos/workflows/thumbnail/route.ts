import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

// Leonardo create-generation response
type LeonardoCreateGenerationResponse = {
  sdGenerationJob?: {
    generationId: string;
    apiCreditCost?: number | null;
    cost?: {
      amount: string;
      unit: string;
    };
  };
};

// Leonardo get-generation-by-id response (simplified)
type LeonardoGetGenerationResponse = {
  generations_by_pk?: {
    status: "PENDING" | "COMPLETE" | "FAILED";
    generated_images: Array<{
      url: string;
    }>;
  };
};

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId, prompt } = input;

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

  const utapi = new UTApi();

  // ✅ 1) Create Leonardo generation (Phoenix 1.0)
  const createRes = await context.call<LeonardoCreateGenerationResponse>(
    "leonardo-create-generation",
    {
      url: "https://cloud.leonardo.ai/api/rest/v1/generations",
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.LEONARDO_API_KEY!}`,
        "content-type": "application/json",
      },
      body: {
        // Leonardo Phoenix 1.0 model
        modelId: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3",
        prompt,
        num_images: 1,
        width: 1024,
        height: 576,
        contrast: 3.5, // medium
        styleUUID: "111dc692-d470-4eec-b791-3475abac4c46", // Dynamic style
        enhancePrompt: false,
      },
    }
  );

  // context.call returns { status, body, headers } — Leonardo response is in body
  const createBody = createRes.body as LeonardoCreateGenerationResponse | undefined;
  const generationId = createBody?.sdGenerationJob?.generationId;

  if (!generationId) {
    const status = createRes.status ?? "?";
    const errDetail =
      typeof createBody === "object" && createBody !== null
        ? JSON.stringify(createBody)
        : String(createBody);
    throw new Error(
      `Failed to create Leonardo generation (HTTP ${status}). Response: ${errDetail}`
    );
  }

  // ✅ 2) Poll Leonardo until generation is COMPLETE, then get image URL
  let tempThumbnailUrl: string | null = null;

  for (let i = 0; i < 15; i++) {
    const getRes = await context.call<LeonardoGetGenerationResponse>(
      "leonardo-get-generation",
      {
        url: `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.LEONARDO_API_KEY!}`,
        },
      }
    );

    const gen = getRes.body.generations_by_pk;

    if (!gen) {
      // Not ready yet, wait and retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }

    if (gen.status === "FAILED") {
      throw new Error("Leonardo generation failed");
    }

    if (gen.status === "COMPLETE" && gen.generated_images?.length > 0) {
      tempThumbnailUrl = gen.generated_images[0].url;
      break;
    }

    // Still pending
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (!tempThumbnailUrl) {
    throw new Error("Timed out waiting for Leonardo image");
  }

  // ✅ 3) Upload Leonardo image URL to UploadThing before deleting the old thumbnail.
  const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
    // Single URL → single result (not array)
    const result = await utapi.uploadFilesFromUrl(tempThumbnailUrl!);

    if (result.error || !result.data) {
      throw new Error("Upload failed");
    }

    const file = result.data;
    return {
      key: file.key,
      url: "ufsUrl" in file && typeof file.ufsUrl === "string" ? file.ufsUrl : file.url,
    };
  });

  // ✅ 4) Update video thumbnail in DB
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadedThumbnail.key,
        thumbnailUrl: uploadedThumbnail.url,
        updatedAt: new Date(),
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });

  // ✅ 5) Cleanup old thumbnail only after the new thumbnail is safely stored.
  await context.run("cleanup-old-thumbnail", async () => {
    if (video.thumbnailKey && video.thumbnailKey !== uploadedThumbnail.key) {
      await utapi.deleteFiles(video.thumbnailKey);
    }
  });

  // No return value: Upstash workflow route expects Promise<void>
});

