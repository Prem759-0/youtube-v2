import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Hook to manually sync user profile from Clerk to database
 * Use when webhook sync fails or user profile is stale
 * 
 * Example usage:
 * ```tsx
 * const { syncProfile, isSyncing } = useSyncProfile();
 * 
 * return (
 *   <button onClick={syncProfile} disabled={isSyncing}>
 *     {isSyncing ? "Syncing..." : "Sync Profile"}
 *   </button>
 * );
 * ```
 */
export const useSyncProfile = () => {
  const { isSignedIn } = useAuth();

  const syncProfile = useCallback(async () => {
    if (!isSignedIn) {
      toast.error("You must be signed in");
      return;
    }

    try {
      const response = await fetch("/api/users/sync-profile", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to sync profile");
        return;
      }

      toast.success("Profile synced successfully!");
      
      // Optionally reload page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Something went wrong while syncing");
    }
  }, [isSignedIn]);

  return {
    syncProfile,
  };
};
