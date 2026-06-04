"use client";

import { useUserProfileSync } from "@/hooks/use-user-profile-sync";

/**
 * This component runs the user profile sync hook
 * It should be placed in a layout that wraps your entire authenticated app
 */
export const UserProfileSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  // This hook monitors for profile changes and invalidates caches
  useUserProfileSync();

  return children;
};
