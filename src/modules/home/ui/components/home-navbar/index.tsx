"use client";

import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchInput } from "./home-input"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import Image from "next/image";
import Link from "next/link"
import { useState } from "react";
import { SearchIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HomeNavbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-2 sm:gap-4 w-full justify-between">

                {isSearchOpen && (
                    <div className="flex items-center gap-4 w-full">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(false)}
                            className="shrink-0"
                        >
                            <ArrowLeftIcon />
                        </Button>
                        <div className="flex-1 max-w-[720px] mx-auto">
                            <SearchInput />
                        </div>
                    </div>
                )}

                {!isSearchOpen && (
                    <>
                        {/* Menu and Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <SidebarTrigger />
                            <Link prefetch href="/">
                                <div className="p-1 sm:p-4 flex items-center gap-1">
                                    <Image src="/logo.svg" height={32} width={32} alt="Logo" />
                                    <p className="text-xl font-semibold tracking-tight">YouTube</p>
                                </div>
                            </Link>
                        </div>

                        {/* Search bar - hidden on small screens */}
                        <div className="hidden sm:flex flex-1 justify-center max-w-[720px] mx-auto">
                            <SearchInput />
                        </div>

                        {/* Actions (Search icon for mobile + Auth) */}
                        <div className="flex-shrink-0 items-center flex gap-1 sm:gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="sm:hidden"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <SearchIcon className="size-5" />
                            </Button>
                            <AuthButton />
                        </div>
                    </>
                )}

            </div>
        </nav>
    )
}