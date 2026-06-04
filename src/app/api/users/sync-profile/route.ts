import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Manual sync endpoint to update user profile from Clerk to database
 * Useful for testing or forcing a sync if webhook fails
 * 
 * Usage: POST /api/users/sync-profile
 */
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No user session" }), 
        { status: 401 }
      );
    }

    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return new Response(
        JSON.stringify({ error: "User not found in Clerk" }), 
        { status: 404 }
      );
    }

    // Build name from first and last name
    const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "User";
    const imageUrl = clerkUser.imageUrl || "/placeholder.svg";

    // Update or create user record
    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, userId))
      .returning();

    // If user doesn't exist, create them
    if (!updatedUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          name,
          imageUrl,
        })
        .returning();

      return Response.json({
        success: true,
        action: "created",
        user: newUser,
      });
    }

    return Response.json({
      success: true,
      action: "updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error syncing user profile:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { status: 500 }
    );
  }
}
