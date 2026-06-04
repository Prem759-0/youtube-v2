+"use client";

import { SidebarProvider } from "@/components/ui/sidebar"
import { StudioNavbar } from "../components/studio-navbar"
import {StudioSidebar} from "../components/Studio-sidebar";
import { UserProfileSyncWrapper } from "@/components/user-profile-sync-wrapper";

interface StudioLayoutProps {
    children: React.ReactNode;
};

export const StudioLayout = ({ children }: StudioLayoutProps) => {
    return (
        <UserProfileSyncWrapper>
            <SidebarProvider>
            <div className="w-full">
                <StudioNavbar />
                <div className="flex min-h-screen pt-[4rem]">
                    <StudioSidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
            </SidebarProvider>
        </UserProfileSyncWrapper>
    )
}

