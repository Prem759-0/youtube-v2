import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {VideoGetOneOutput} from "../../types";
import {useClerk} from "@clerk/nextjs";
import {trpc} from "@/trpc/client"
import { toast } from "sonner";

interface VideoReactionsProps {
    videoId: string;
    likes: number;
    dislikes: number;
    viewerReaction:  VideoGetOneOutput["viewerReaction"]
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}:VideoReactionsProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const like = trpc.videoReactions.like.useMutation(
     {  onSuccess:()=>{
        utils.videos.getOne.invalidate({ id :videoId });
        utils.playlists.getLiked.invalidate();
     },
         onError: (error)=> {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }}
    );

    const dislike = trpc.videoReactions.dislike.useMutation(
        {  onSuccess:()=>{
        utils.videos.getOne.invalidate({ id :videoId });
        utils.playlists.getLiked.invalidate();
     },
         onError: (error)=> {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }}
    );

    return (
        <div className="flex items-center flex-none">
            <Button
              onClick={()=> like.mutate({videoId})}
              disabled={like.isPending || dislike.isPending}
              variant="secondary"
              className="rounded-l-full rounded-r-none gap-2 pr-4 cursor-pointer"
            >
                <div className="relative">
                  <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")}/>
                  {like.isPending && (
                    <div className="absolute -inset-1 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Spinner className="size-4" />
                    </div>
                  )}
                </div>
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
               onClick={()=> dislike.mutate({videoId})}
              disabled={like.isPending || dislike.isPending}
              variant="secondary"
              className="rounded-l-none rounded-r-full  pl-3 cursor-pointer"
            >
                <div className="relative">
                  <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-black")}/>
                  {dislike.isPending && (
                    <div className="absolute -inset-1 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Spinner className="size-4" />
                    </div>
                  )}
                </div>
                {dislikes}
            </Button>
        </div>
    );
};