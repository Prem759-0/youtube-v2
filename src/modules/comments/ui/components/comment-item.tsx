import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import {toast} from "sonner"
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface CommentItemProps {
    comment: CommentsGetManyOutput["items"][number];
};

export const CommentItem = ({ comment }: CommentItemProps) =>{
    const clerk = useClerk();
    const {userId} =  useAuth(); 

    const utils = trpc.useUtils()
    const remove = trpc.comments.remove.useMutation({
        onSuccess: ()  => {
            toast.success("Comment deleted successfully ✅");
            utils.comments.getMany.invalidate({videoId: comment.videoId})
        },
        onError: (error)  => {
            toast.error("Failed to delete comment ‼️");

            if (error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn();
            }
        },
    });

    return(
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                   <UserAvatar
                     size="lg"
                     imageUrl={comment.user.imageUrl}
                     name={comment.user.name}
                   />
                </Link>
                <div className="flex-1 min-w-0">
                   <Link href={`/users/${comment.userId}`}>
                      <div className="flex items-center gap-2 mb-0.5">
                         <span className="font-medium text-sm pb-0.5">
                            {comment.user.name}
                         </span>
                         <span  className="text-xs text-muted-foreground">
                            {formatDistanceToNow(comment.createdAt,{
                                addSuffix: true,
                            })}
                         </span>
                      </div>
                   </Link>
                   <p className="text-sm">{comment.value}</p>
                   <div className="flex items-center gap-2 mt-1">
                     <div className="flex items-center">
                        <Button 
                           disabled={false}
                           variant="ghost"
                           size="icon"
                           className="size-8"
                           onClick={()=>{}}
                        >
                          <ThumbsUpIcon className={cn()}/>
                        </Button>

                        <span className="text-xs text-muted-foreground">
                            {comment.likeCount}    
                        </span>

                        <Button 
                           disabled={false}
                           variant="ghost"
                           size="icon"
                           className="size-8"
                           onClick={()=>{}}
                        >
                          <ThumbsDownIcon className={cn()}/>
                        </Button>

                        <span className="text-xs text-muted-foreground">
                            {comment.dislikeCount}    
                        </span>
                        
                     </div>
                   </div>

                </div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild >
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={()=>{}}>
                            <MessageSquareIcon className="size-4 "/>
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                        <DropdownMenuItem onClick={()=> remove.mutate({id: comment.id})}>
                            <Trash2Icon className="size-4 "/>
                            Delete
                        </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}