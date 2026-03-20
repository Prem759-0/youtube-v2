import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";

interface CommentFormProps {
    videoId: string;
    onSuccess?:()=>void
}

export const CommentForm = ({
    videoId, 
    onSuccess
}: CommentFormProps) => {
    const {user} = useUser();

    return (
        <form className="flex gap-4 group">
           <UserAvatar
              size="lg"
              imageUrl={user?.imageUrl || "placeholder.svg"}
              name={user?.username || "User"}
           />
        </form>
    )
}

 