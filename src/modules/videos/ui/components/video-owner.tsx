import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";


interface VideoOwnerProps {
    user: VideoGetOneOutput["user"];
    videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId: clerkUserId, isLoaded } = useAuth();
    const { isPending, isSubscribed, onClick, subscriberCount } = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        initialSubscriberCount: user.subscriberCount,
    })

    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link prefetch  href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0" >
                    <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
                    <div className="flex flex-col gap-1 min-w-0">
                        <UserInfo name={user.name} size="lg" />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}
                        </span>
                    </div>
                </div>
            </Link>
            {clerkUserId === user.clerkId ? (
                <Button
                    variant="secondary"
                    className="rounded-full"
                    asChild
                >
                    <Link prefetch  href={`/studio/video/${videoId}`}>
                        Edit video
                    </Link>
                </Button>
            ) : (
                <SubscriptionButton
                    onClick={onClick}
                    disabled={isPending || !isLoaded}
                    isSubscribed={isSubscribed}
                    className="flex-none"
                />
            )}
        </div>
    )
}