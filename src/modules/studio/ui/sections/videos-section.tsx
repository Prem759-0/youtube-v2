"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constants";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      {/* Table now has a minimum width so it doesn't squish on small screens */}
      <Table className="table-fixed w-full min-w-[1000px]">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[40%]">Video</TableHead>
            <TableHead className="w-[12%]">Visibility</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[12%]">Date</TableHead>
            <TableHead className="text-right w-[8%]">Views</TableHead>
            <TableHead className="text-right w-[8%]">Comments</TableHead>
            <TableHead className="text-right pr-6 w-[8%]">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="pl-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-36 shrink-0" />
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                    <Skeleton className="h-3 w-full max-w-[300px]" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right pr-6">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const VideosSectionSuspense = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div className="relative">
      {isNavigating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent" />
        </div>
      )}
      <div className="border-y overflow-x-auto">
        {/* Same min-width applied here for consistency */}
        <Table className="table-fixed w-full min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[40%]">Video</TableHead>
              <TableHead className="w-[12%]">Visibility</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[12%]">Date</TableHead>
              <TableHead className="text-right w-[8%]">Views</TableHead>
              <TableHead className="text-right w-[8%]">Comments</TableHead>
              <TableHead className="text-right pr-6 w-[8%]">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <TableRow
                  key={video.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsNavigating(true);
                    router.push(`/studio/video/${video.id}`);
                  }}
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0">
                        <VideoThumbnail
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          title={video.title}
                          duration={video.duration || 0}
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 gap-y-1">
                        <span className="text-sm font-medium truncate">
                          {video.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {video.description || "No description"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center truncate">
                      {video.visibility === "private" ? (
                        <LockIcon className="size-4 mr-2 shrink-0" />
                      ) : (
                        <Globe2Icon className="size-4 mr-2 shrink-0" />
                      )}
                      <span className="truncate">{snakeCaseToTitle(video.visibility)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate">
                      {snakeCaseToTitle(video.muxStatus || "error")}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm truncate">
                    {format(new Date(video.createdAt), "d MMM yyy")}
                  </TableCell>
                  <TableCell className="text-right truncate">views</TableCell>
                  <TableCell className="text-right truncate">comments</TableCell>
                  <TableCell className="text-right pr-6 truncate">likes</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};