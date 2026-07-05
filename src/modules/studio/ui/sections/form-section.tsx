"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import {
  MoreVerticalIcon,
  CopyCheckIcon,
  TrashIcon,
  CopyIcon,
  Globe2Icon,
  LockIcon,
  ImagePlusIcon,
  SparklesIcon,
  RotateCcwIcon,
  RefreshCwIcon,
  Loader2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { videoUpdateSchema } from "@/db/schema";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { snakeCaseToTitle } from "@/lib/utils";
import { toast } from "sonner";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";
import { ThumbnailGenerateModal } from "../components/thumbnail-generate-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/constants";


interface FormSectionProps {
  videoId: string;
}

type AIGeneratorType = "title" | "description" | "thumbnail";

const aiGuideContent: Record<AIGeneratorType, { title: string; timing: string; hint: string; statusTitle: string }> = {
  title: {
    title: "Generate title",
    timing: "about 1–3 minutes",
    hint: "This will create an SEO-friendly title for your video based on the transcript.",
    statusTitle: "Title generation started",
  },
  description: {
    title: "Generate description",
    timing: "about 1–3 minutes",
    hint: "This will create a short summary and description for your video.",
    statusTitle: "Description generation started",
  },
  thumbnail: {
    title: "Generate thumbnail",
    timing: "about 2–5 minutes",
    hint: "This will create an AI thumbnail for your video. The process can take a little longer.",
    statusTitle: "Thumbnail generation started",
  },
};

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary
        fallback={<p>Something went wrong. Please try again later.</p>}
        onError={(error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }}
      >
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[220px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[84px] w-[153px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="px-4 py-4 space-y-6" >
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

    </div>
  )
}

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] = useState(false);
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState<AIGeneratorType | null>(null);
  const [activeAiStatus, setActiveAiStatus] = useState<AIGeneratorType | null>(null);

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored ✅");
    },
    onError: () => {
      toast.error("Something went wrong ❌")
    }
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Background job started", { description: "this may take some time" });
    },
    onError: () => {
      toast.error("Something went wrong ❌")
    }
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Background job started", { description: "this may take some time" });
    },
    onError: () => {
      toast.error("Something went wrong ❌")
    }
  });



  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: {
      title: video.title ?? "",
      description: video.description ?? "",
      categoryId: video.categoryId ?? "",
      visibility: video.visibility ?? "public",

    },
  });

  const { mutate: update, isPending: isUpdating } =
    trpc.studio.update.useMutation({
      onSuccess: () => toast.success("Video updated successfully ✅"),
      onError: () =>
        toast.error("Something went wrong, please try again later ❌"),
    });

  const { mutate: deleteVideo, isPending: isDeleting } =
    trpc.studio.delete.useMutation({
      onSuccess: async () => {
        await utils.studio.getMany.invalidate();
        toast.success("Video deleted successfully ✅");
        router.replace("/studio");
      },
      onError: (error) => {
        setIsDeleteDialogOpen(false);
        toast.error(error.message || "Something went wrong, please try again later ❌");
      },
    });

  const revalidate = trpc.videos.revalidate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      utils.videos.getOne.invalidate({ id: videoId });
      toast.success("Video revalidated successfully ✅");
    },
    onError: () =>
      toast.error("Something went wrong, please try again later ❌"),
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update({ id: video.id, ...data });
  };



  const onDelete = () => {
    deleteVideo({ id: video.id });
  };

  const getGuideStorageKey = (type: AIGeneratorType) => `studio_ai_guide_seen_${videoId}_${type}`;

  const handleAIGeneratorClick = (type: AIGeneratorType, action: () => void) => {
    if (typeof window === "undefined") {
      action();
      return;
    }

    const storageKey = getGuideStorageKey(type);
    const hasSeenGuide = window.localStorage.getItem(storageKey) === "true";

    if (!hasSeenGuide) {
      setActiveGuide(type);
      return;
    }

    action();
  };

  const handleGuideDismiss = (type: AIGeneratorType) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getGuideStorageKey(type), "true");
    }

    setActiveGuide(null);
  };

  const handleGuideConfirm = (type: AIGeneratorType) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getGuideStorageKey(type), "true");
    }

    setActiveGuide(null);

    if (type === "title") {
      setActiveAiStatus("title");
      generateTitle.mutate({ id: videoId });
      return;
    }

    if (type === "description") {
      setActiveAiStatus("description");
      generateDescription.mutate({ id: videoId });
      return;
    }

    setActiveAiStatus("thumbnail");
    setThumbnailGenerateModalOpen(true);
  };

  const fullUrl = `${APP_URL
    }/videos/${videoId}`;

  const [isCopied, setIsCopied] = useState(false);
  const hasReadySubtitles = video.muxTrackStatus === "ready" && !!video.muxTrackId;
  const needsMuxSync = video.muxStatus !== "ready" || !video.muxPlaybackId;
  const showMissingSubtitlesNotice = !needsMuxSync && !hasReadySubtitles;

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
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
      {revalidate.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          {/* Top Loading Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600/20 overflow-hidden">
            <div
              className="h-full bg-red-600 w-1/3"
              style={{ animation: "yt-progress 1.5s infinite linear", transform: "translateX(-100%)" }}
            />
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes yt-progress {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(300%); }
                }
             `}} />
          </div>

          {/* Center Content */}
          <div className="flex flex-col items-center justify-center gap-5">
            {/* YouTube Red Spinner */}
            <div className="relative size-12">
              <svg className="animate-spin size-full text-red-600" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeDasharray="90, 150" strokeDashoffset="-10" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-white text-xl font-medium tracking-tight drop-shadow-md">
                Revalidating video...
              </h3>
              <p className="text-white/70 text-sm drop-shadow-md">
                Please wait while we sync your changes.
              </p>
            </div>
          </div>
        </div>
      )}
      <ThumbnailGenerateModal
        open={thumbnailGenerateModalOpen}
        onOpenChange={setThumbnailGenerateModalOpen}
        videoId={videoId}
      />
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>

            <div className="flex items-center gap-3 ">
              <Button type="submit" disabled={isUpdating || !form.formState.isDirty} >
                {isUpdating ? "Saving..." : "Save"}
              </Button>

              <DropdownMenu>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/80"
                  size="icon"
                  disabled={revalidate.isPending}
                  onClick={() => revalidate.mutate({ id: videoId })}
                >
                  <RefreshCwIcon className={`size-5 ${revalidate.isPending ? "animate-spin" : ""}`} />
                </Button>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isDeleting}>
                    {isDeleting ? (
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
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {needsMuxSync && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-100">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">Video is still syncing from Mux</p>
                  <p>
                    If your video or thumbnail already appears in Mux but not here yet, wait a minute and click
                    revalidate again.
                  </p>
                  <p className="text-xs">
                    Current video status: {snakeCaseToTitle(video.muxStatus || "preparing")} · Subtitles status:{" "}
                    {snakeCaseToTitle(video.muxTrackStatus || "no_subtitles")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={revalidate.isPending}
                  onClick={() => revalidate.mutate({ id: videoId })}
                  className="shrink-0"
                >
                  {revalidate.isPending ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCwIcon className="mr-2 size-4" />
                      Revalidate now
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-3 space-y-8">
              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          size="icon"
                          variant="outline"
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() => handleAIGeneratorClick("title", () => generateTitle.mutate({ id: videoId }))}
                          disabled={generateTitle.isPending || !hasReadySubtitles}
                        >
                          {generateTitle.isPending
                            ? <Loader2Icon className="animate-spin " />
                            : <SparklesIcon className="cursor-pointer" />
                          }
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 max-w-[640px] text-sm px-3"
                        placeholder="Add a title to your video"
                      />
                    </FormControl>
                    {showMissingSubtitlesNotice && (
                      <div className="mt-3 max-w-[640px] rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300">
                        <div className="font-semibold">No subtitles available yet</div>
                        <p className="mt-1">AI title generation needs a transcript. If Mux generated subtitles for this video, click Revalidate now to pull them in. If Mux has no subtitles, upload or enable subtitles first.</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={revalidate.isPending}
                          onClick={() => revalidate.mutate({ id: videoId })}
                          className="mt-3"
                        >
                          {revalidate.isPending ? "Checking Mux..." : "Check subtitles from Mux"}
                        </Button>
                      </div>
                    )}
                    {activeGuide === "title" && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        <div className="font-semibold">{aiGuideContent.title.title}</div>
                        <p className="mt-1">{aiGuideContent.title.hint}</p>
                        <p className="mt-1">Estimated time: {aiGuideContent.title.timing}.</p>
                        <p className="mt-1">After it finishes, click the refresh button to revalidate and update the result.</p>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleGuideDismiss("title")}>
                            Later
                          </Button>
                          <Button type="button" size="sm" onClick={() => handleGuideConfirm("title")}>
                            Got it
                          </Button>
                        </div>
                      </div>
                    )}
                    {activeAiStatus === "title" && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                        <div className="font-semibold">{aiGuideContent.title.statusTitle}</div>
                        <p className="mt-1">Your request is now running in the background. This usually takes {aiGuideContent.title.timing}. When it is done, use the refresh button at the top-right to revalidate.</p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          size="icon"
                          variant="outline"
                          type="button"
                          className="rounded-full size-6 [&_svg]:size-3"
                          onClick={() => handleAIGeneratorClick("description", () => generateDescription.mutate({ id: videoId }))}
                          disabled={generateDescription.isPending || !hasReadySubtitles}
                        >
                          {generateDescription.isPending
                            ? <Loader2Icon className="animate-spin " />
                            : <SparklesIcon className="cursor-pointer" />
                          }
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        className="min-h-[168px] max-w-[640px] text-sm px-3 py-2 resize-none"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                    {showMissingSubtitlesNotice && (
                      <div className="mt-3 max-w-[640px] rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300">
                        <div className="font-semibold">No subtitles available yet</div>
                        <p className="mt-1">AI description generation needs a transcript. If Mux generated subtitles for this video, click Revalidate now to pull them in. If Mux has no subtitles, upload or enable subtitles first.</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={revalidate.isPending}
                          onClick={() => revalidate.mutate({ id: videoId })}
                          className="mt-3"
                        >
                          {revalidate.isPending ? "Checking Mux..." : "Check subtitles from Mux"}
                        </Button>
                      </div>
                    )}
                    {activeGuide === "description" && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        <div className="font-semibold">{aiGuideContent.description.title}</div>
                        <p className="mt-1">{aiGuideContent.description.hint}</p>
                        <p className="mt-1">Estimated time: {aiGuideContent.description.timing}.</p>
                        <p className="mt-1">After it finishes, click the refresh button to revalidate and update the result.</p>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleGuideDismiss("description")}>
                            Later
                          </Button>
                          <Button type="button" size="sm" onClick={() => handleGuideConfirm("description")}>
                            Got it
                          </Button>
                        </div>
                      </div>
                    )}
                    {activeAiStatus === "description" && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                        <div className="font-semibold">{aiGuideContent.description.statusTitle}</div>
                        <p className="mt-1">Your request is now running in the background. This usually takes {aiGuideContent.description.timing}. When it is done, use the refresh button at the top-right to revalidate.</p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                          className="object-cover"
                          fill
                          alt="Thumbnail"
                        />
                        {/* Spinner overlay while upload modal is open */}
                        {thumbnailModalOpen && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 
                             rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 
                             duration-300 size-7 "
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)} >
                              <ImagePlusIcon className="size-4 mr-1" />
                              Change thumbnail
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleAIGeneratorClick("thumbnail", () => setThumbnailGenerateModalOpen(true))}
                            >
                              <SparklesIcon className="size-4 mr-1" />
                              AI-generated
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => restoreThumbnail.mutate({ id: videoId })}>
                              <RotateCcwIcon className="size-4 mr-1" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                    {activeGuide === "thumbnail" && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        <div className="font-semibold">{aiGuideContent.thumbnail.title}</div>
                        <p className="mt-1">{aiGuideContent.thumbnail.hint}</p>
                        <p className="mt-1">Estimated time: {aiGuideContent.thumbnail.timing}.</p>
                        <p className="mt-1">After it finishes, click the refresh button to revalidate and update the result.</p>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleGuideDismiss("thumbnail")}>
                            Later
                          </Button>
                          <Button type="button" size="sm" onClick={() => handleGuideConfirm("thumbnail")}>
                            Got it
                          </Button>
                        </div>
                      </div>
                    )}
                    {activeAiStatus === "thumbnail" && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                        <div className="font-semibold">{aiGuideContent.thumbnail.statusTitle}</div>
                        <p className="mt-1">Your request is now running in the background. This usually takes {aiGuideContent.thumbnail.timing}. When it is done, use the refresh button at the top-right to revalidate.</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="max-w-[320px]">
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />







            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>

                <div className="p-4 flex flex-col gap-y-6">
                  {/* VIDEO LINK */}
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">Video link</p>
                      <div className="flex items-center gap-x-2">
                        <Link prefetch  href={`/videos/${video.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* VIDEO STATUS */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>

                  {/* SUBTITLES STATUS */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Subtitles status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "no_subtitles"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* VISIBILITY */}
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="max-w-[320px]">
                        <FormLabel>Visibility</FormLabel>
                        <Select
                          value={field.value ?? "public"}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center">
                                <Globe2Icon className="size-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center">
                                <LockIcon className="size-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            if (!isDeleting) {
              setIsDeleteDialogOpen(open);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                video and all of its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onDelete();
                }}
                disabled={isDeleting}
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
      </Form>
    </>
  );
};
