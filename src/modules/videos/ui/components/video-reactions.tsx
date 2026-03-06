import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export const VideoReactions = () => {
    const viewerReaction: "like" | "dislike" = "like"

    return (
        <div className="flex items-center flex-none">
            <Button
              variant="secondary"
              className="rounded-l-full rounded-r-none gap-2 pr-4"
            >
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")}/>
                {1}
            </Button>
            <Separator/>
            <Button
              variant="secondary"
              className="rounded-l-full rounded-r-none gap-2 pl-4"
            >
                <ThumbsDownIcon className={cn("size-5", viewerReaction !== "like" && "fill-black")}/>
                {1}
            </Button>
            <Separator/>
        </div>
    );
};