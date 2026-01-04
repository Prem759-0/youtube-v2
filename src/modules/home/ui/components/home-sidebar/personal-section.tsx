"use client";

import {
    SidebarGroup, 
    SidebarGroupContent, 
    SidebarGroupLabel, 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useClerk, useAuth } from "@clerk/nextjs";
import {
   HistoryIcon,
   ThumbsUpIcon,
   ListVideoIcon,
} from "lucide-react"

const items = [
    {
        title: "History",
        url: "/playlists/history",
        icon: HistoryIcon,
        auth: true,
    },
    {
        title: "Liked videos",
        url: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true,
    },
    {
        title: "All playlists",
        url: "/feed/trending",
        icon: ListVideoIcon,
         auth: true,
    },
];

export const PersonalSection = () => {
 
    const clerk = useClerk();
     const {isSignedIn} = useAuth();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item)=>(
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              tooltip={item.title}
                              asChild
                              isActive={false}
                              onClick={(e)=>{
                                if (!isSignedIn && item.auth){
                                    e.preventDefault();
                                 return clerk.openSignIn();
                                }
                              }}
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                  <item.icon/>
                                  <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}