import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Error: Verification error", { status: 400 });
  }

  // --------------------
  // Handle events
  // --------------------

  if (evt.type === "user.created") {
    const { data } = evt;

    await db.insert(users).values({
      clerkId: data.id,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      imageUrl: data.image_url,
    });
  }

  if (evt.type === "user.deleted") {
    const clerkId = evt.data.id;

    if (!clerkId) {
      return new Response("Missing user id", { status: 400 });
    }

    await db.delete(users).where(eq(users.clerkId, clerkId));
  }

  if (evt.type === "user.updated") {
    const { data } = evt;
    const clerkId = data.id;

    if (!clerkId) {
      return new Response("Missing user id", { status: 400 });
    }

    await db
      .update(users)
      .set({
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        imageUrl: data.image_url,
      })
      .where(eq(users.clerkId, clerkId));
  }

  return new Response("Webhook received", { status: 200 });
}
