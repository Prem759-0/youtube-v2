"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constants";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { Globe2Icon, Loader2Icon, LockIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

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
            <TableHead className="text-right w-[8%]">Likes</TableHead>
            <TableHead className="pr-6 text-right w-[6%]">Actions</TableHead>
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
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="pr-6 text-right">
                <Skeleton className="h-8 w-8 ml-auto rounded-full" />
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
  const utils = trpc.useUtils();
  const [isNavigating, setIsNavigating] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<{ id: string; title: string } | null>(null);
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { mutate: deleteVideo, isPending: isDeleting } = trpc.studio.delete.useMutation({
    onSuccess: async () => {
      await utils.studio.getMany.invalidate();
      toast.success("Video deleted successfully ✅");
      setVideoToDelete(null);
    },
    onError: (error) => {
      setVideoToDelete(null);
      toast.error(error.message || "Something went wrong, please try again later ❌");
    },
  });

  const onDelete = () => {
    if (!videoToDelete) {
      return;
    }

    deleteVideo({ id: videoToDelete.id });
  };

  return (
    <div className="relative">
      {isDeleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600/20 overflow-hidden">
            <div
              className="h-full bg-red-600 w-1/3"
              style={{ animation: "yt-delete-progress 1.5s infinite linear", transform: "translateX(-100%)" }}
            />
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes yt-delete-progress {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(300%); }
                }
             `}} />
          </div>

          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl bg-background/95 px-8 py-7 text-center shadow-2xl">
            <Loader2Icon className="size-12 animate-spin text-red-600" />
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-xl font-semibold tracking-tight">
                Deleting video...
              </h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                Please wait while we remove this video from your studio.
              </p>
            </div>
          </div>
        </div>
      )}
      {isNavigating && !isDeleting && (
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
              <TableHead className="text-right w-[8%]">Likes</TableHead>
              <TableHead className="pr-6 text-right w-[6%]">Actions</TableHead>
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
                    if (isDeleting) {
                      return;
                    }

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
                  <TableCell className="text-right truncate">{video.viewCount}</TableCell>
                  <TableCell className="text-right truncate">{video.commentCount}</TableCell>
                  <TableCell className="text-right truncate">{video.likeCount}</TableCell>
                  <TableCell className="pr-6 text-right" onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isDeleting}>
                          {isDeleting && videoToDelete?.id === video.id ? (
                            <Loader2Icon className="size-5 animate-spin" />
                          ) : (
                            <MoreVerticalIcon className="size-5" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          disabled={isDeleting}
                          onClick={() => setVideoToDelete({ id: video.id, title: video.title })}
                        >
                          <TrashIcon className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!videoToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setVideoToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete video?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {videoToDelete ? `“${videoToDelete.title}”` : "this video"} and all of its data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                onDelete();
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};