"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface ResultsSectionProps {
    query: string | undefined;
    categoryId: string | undefined;
}

export const ResultsSection = ({
    query,
    categoryId,
}: ResultsSectionProps) => {
    const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
        {
            query,
            categoryId,
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    )

    return (
       <>
          <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {results.pages
              .flatMap((page)=> page.items)
              .map((video) => (
                <VideoGridCard key={video.id} data={video} />
              ))
            }
          </div>
          <div className="hidden flex-col gap-4 md:flex max-w-[1096px]">
            {results.pages
              .flatMap((page)=> page.items)
              .map((video) => (
                <VideoRowCard key={video.id} data={video}  />
              ))
            }
          </div>
          <InfiniteScroll
            hasNextPage={resultsQuery.hasNextPage}
            isFetchingNextPage={resultsQuery.isFetchingNextPage}
            fetchNextPage={resultsQuery.fetchNextPage}
          />
       </>
    )
}