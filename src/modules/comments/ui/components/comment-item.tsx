"use client";

import Link from "next/link";
import { useState } from "react";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}

export const CommentItem = ({
  comment,
  variant = "comment",
}: CommentItemProps) => {
  const clerk = useClerk();
  const { userId } = useAuth();

  const [expanded, setExpanded] = useState(false);

  const utils = trpc.useUtils();

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted successfully ✅");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to delete comment ‼️");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        
        {/* Avatar */}
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          
          {/* Name + Time */}
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                  includeSeconds: false,
                })}
              </span>
            </div>
          </Link>

          {/* Comment Text */}
          <div className="text-sm">
            <p
              className={cn(
                "whitespace-pre-line break-words",
                !expanded && "line-clamp-3"
              )}
            >
              {comment.value}
            </p>

            {comment.value.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-medium text-muted-foreground mt-1 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5">
              
              {/* Like */}
              <Button
                disabled={like.isPending}
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <div className="relative">
                  <ThumbsUpIcon
                    className={cn(
                      comment.viewerReaction === "like" &&
                        "fill-black dark:fill-white"
                    )}
                  />
                  {like.isPending && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Spinner className="size-4" />
                    </div>
                  )}
                </div>
              </Button>

              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>

              {/* Dislike */}
              <Button
                disabled={dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <div className="relative">
                  <ThumbsDownIcon
                    className={cn(
                      comment.viewerReaction === "dislike" &&
                        "fill-black dark:fill-white"
                    )}
                  />
                  {dislike.isPending && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Spinner className="size-4" />
                    </div>
                  )}
                </div>
              </Button>

              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>

            {/* Reply */}
            {variant === "comment" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => {}}
              >
                Reply
              </Button>
            )}
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4 mr-2" />
              Reply
            </DropdownMenuItem>

            {comment.user.clerkId === userId && (
              <DropdownMenuItem
                onClick={() => remove.mutate({ id: comment.id })}
              >
                <Trash2Icon className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};