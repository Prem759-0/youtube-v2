"use client"

import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface HomeVideosSectionProps {
    categoryId?: string;
}

export const HomeVideosSection = (props: HomeVideosSectionProps)=> {
     return (
        <Suspense fallback={<HomeVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <HomeVideosSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
     )
}

const HomeVideosSectionSkeleton = () => {
    return(
        <div>
            Loading
        </div>
    )
}

const HomeVideosSectionSuspense = ({categoryId}: HomeVideosSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        {categoryId, limit: DEFAULT_LIMIT},
         {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
         }
    );

    return (
        <div>
            {videos.pages
            .flatMap((page)=> page.items)
            .map((video) => (
            <VideoGridCard key={video.id} data={video} />
            ))
            }
        </div>
    )
}