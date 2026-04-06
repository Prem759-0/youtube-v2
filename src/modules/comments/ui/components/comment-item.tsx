import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu"

interface CommentItemProps {
    comment: CommentsGetManyOutput["items"][number];
};

export const CommentItem = ({ comment }: CommentItemProps) =>{

    const remove = trpc.comments.remove.useMutation();

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
                </div>
            </div>
        </div>
    )
}