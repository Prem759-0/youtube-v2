"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { trpc } from "@/trpc/client";

/**
 * Hook that monitors for changes to the current user's profile (name, image)
 * and automatically invalidates tRPC caches when changes are detected.
 * This ensures live updates across all pages showing user data.
 * 
 * Usage: Call this hook once in a layout or root component that wraps your entire app
 * Example: Use in src/app/layout.tsx or src/modules/home/ui/layouts/home-layouts.tsx
 */
export const useUserProfileSync = () => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const lastUserStateRef = useRef<{ name: string; imageUrl: string | null }>({
    name: "",
    imageUrl: null,
  });

  useEffect(() => {
    if (!user) return;

    const currentState = {
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
      imageUrl: user.imageUrl,
    };

    const lastState = lastUserStateRef.current;

    // Check if user profile changed
    if (
      currentState.name !== lastState.name ||
      currentState.imageUrl !== lastState.imageUrl
    ) {
      console.log("📢 User profile changed, invalidating caches...", {
        oldName: lastState.name,
        newName: currentState.name,
        oldImage: lastState.imageUrl,
        newImage: currentState.imageUrl,
      });

      // Update reference
      lastUserStateRef.current = currentState;

      // Invalidate all queries that might include user data
      // This forces a refetch from the server with fresh data
      
      // 1. Videos queries (home page, search, suggestions)
      utils.videos.getMany.invalidate();
      utils.videos.getOne.invalidate();
      
      // 2. Search results
      utils.search.getMany.invalidate();
      
      // 3. Suggestions
      utils.suggestions.getMany.invalidate();
      
      // 4. Comments (which include user info)
      utils.comments.getMany.invalidate();
      
      // 5. Studio videos
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate();

      // Also force sync to database
      fetch("/api/users/sync-profile", { method: "POST" }).catch(console.error);
    }
  }, [user, utils]);
};
