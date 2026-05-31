import {cva , type VariantProps} from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { 
    Tooltip,
    TooltipContent,
    TooltipTrigger,
 } from "@/components/ui/tooltip"

 import { UserAvatar } from "@/components/user-avatar"
 import { UserInfo } from "@/modules/users/ui/components/user-info"
 import { VideoMenu } from "./video-menu"
 import { VideoThumbnail, VideoThumbnailSkeleton } from "./video-thumbnail"
 import { VideoGetManyOutput } from "../../types"
import Link from "next/link"
import { useMemo } from "react"
import { formatDistanceToNow } from "date-fns"

const videoRowCardVariants = cva("group flex min-w-0", {
    variants:{
        size:{
            default: "gap-4 md:gap-6",
            compact: "gap-2"
        },
    },
        defaultVariants:{
            size: "default",
        },
});

const thumbnailVariants = cva("relative flex-none", {
    variants:{
        size:{
            default: "w-[38%] max-w-[360px] min-w-[250px]",
            compact: "w-[168px]",
        },
    },
        defaultVariants:{
            size: "default",
        },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
};

export const VideoRowCardSkeleton = ({size = "default"}: VariantProps<typeof videoRowCardVariants>) => {
    return (
        <div className={videoRowCardVariants({size})}>
            <div className={thumbnailVariants({size})}>
              <VideoThumbnailSkeleton/>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2">
                    <div className="flex-1 min-w-0">
                        <Skeleton className={cn("h-5 w-[40%]", size === "compact" && "h-4 w-[40%]")}/>

                        {size === "default" && (
                            <>
                              <Skeleton className="h-4 w-[20%] mt-1"/>
                              <div className="flex items-center gap-2 my-3">
                                 <Skeleton className="size-8 rounded-full" />
                                 <Skeleton className="h-4 w-24" />
                              </div>
                            </>
                        )}

                        {size === "compact" && (
                            <>
                            <Skeleton className="h-4 w-[50%] mt-1"/>
                            </>
                        )}
                    </div>
               </div>
            </div>
        </div>
    )
}

export const VideoRowCard = ({
    data,
    size = "default" , 
    onRemove,
}:VideoRowCardProps)=>{
    const compactViews = useMemo(()=>{
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.viewCount);
    }, [data.viewCount]);

    const compactLikes = useMemo(()=>{
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.likeCount);
    }, [data.likeCount]);

    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, { addSuffix: true });
    }, [data.createdAt]);

    return(
        <div className={videoRowCardVariants({size})}>
           <Link href={`/videos/${data.id}`} className={thumbnailVariants({size})}>
             <VideoThumbnail
              imageUrl={data.thumbnailUrl}
              previewUrl={data.previewUrl}
              title={data.title}
              duration={data.duration}
             />
           </Link>

           <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-x-2">
                <Link href={`/videos/${data.id}`} className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-medium line-clamp-2",
                    size === "compact" ? "text-sm" : "text-base md:text-lg",
                  )}>
                    {data.title}
                  </h3>
                  {size === "default" && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {compactViews} views • {compactDate}
                    </p>    
                  )}
                  {size === "default" && (
                    <>
                      <div className="flex items-center gap-2 my-3 hidden md:flex">
                        <UserAvatar
                           size="sm"
                           imageUrl={data.user.imageUrl}
                           name={data.user.name}
                        />
                        <UserInfo size="sm" name={data.user.name} />
                      </div>
                      <div className="flex items-center gap-2 my-3 md:hidden">
                        <UserInfo size="sm" name={data.user.name} />
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <p className="text-xs text-muted-foreground line-clamp-2">  
                            {data.description ?? "No description"}
                           </p>
                        </TooltipTrigger>
                        <TooltipContent
                         side="bottom"
                         align="center"
                         className="bg-black/70"
                        >
                            <p>From the video description</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                  {size === "compact" && (
                    <UserInfo size="sm" name={data.user.name} />
                  )}
                  {size === "compact" && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {compactViews} views • {compactDate}
                    </p>
                  )}
                </Link>
                <div className="flex-none">
                    <VideoMenu videoId={data.id} onRemove={onRemove} />
                </div>
            </div>
           </div>
        </div>
    )
}