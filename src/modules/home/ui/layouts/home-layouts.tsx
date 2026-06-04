"use client";

import { SidebarProvider } from "@/components/ui/sidebar"
import { HomeNavbar } from "../components/home-navbar";
import { HomeSidebar } from "../components/home-sidebar";
import { usePathname } from "next/navigation";
import { SidebarStateWatcher } from "./sidebar-state-watcher";
import { UserProfileSyncWrapper } from "@/components/user-profile-sync-wrapper";

interface HomeLayoutProps {
    children: React.ReactNode;
};

export const HomeLayout = ({ children }: HomeLayoutProps) => {
    const pathname = usePathname();
    const isVideoPage = pathname?.includes("/videos/");

    return (
        <UserProfileSyncWrapper>
            <SidebarProvider defaultOpen={false}>
                <SidebarStateWatcher />
            <div className="w-full">
                <HomeNavbar />
                <div className="flex min-h-screen pt-[4rem]">
                    <HomeSidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
        </UserProfileSyncWrapper>
    )
}


