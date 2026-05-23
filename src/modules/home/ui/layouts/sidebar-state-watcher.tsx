"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const SidebarStateWatcher = () => {
    const pathname = usePathname();
    const { setOpen } = useSidebar();

    useEffect(() => {
        if (pathname.includes("/videos/")) {
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return null;
};


