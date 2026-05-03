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
 import { VideoThumbnail } from "./video-thumbnail"
 import { VideoGetManyOutput } from "../../types"
import Link from "next/link"

const videoRowCardVariants = cva("group flex min-w-0", {
    variants:{
        size:{
            default: "gap-4",
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
            default: "w-[38%]",
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

export const VideoRowCardSkeleton = () => {
    return (
        <div>
            Skeleton
        </div>
    )
}

export const VideoRowCard = ({
    data,
    size, 
    onRemove,
}:VideoRowCardProps)=>{
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
                    size === "compact" ? "text-sm" : "text-base",
                  )}>
                    {data.title}
                  </h3>
                  {size === "default" && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {data.viewCount} views • {data.likeCount} likes
                    </p>    
                  )}
                </Link>
            </div>
           </div>
        </div>
    )
}