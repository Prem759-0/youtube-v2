import { useState } from "react";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";

interface UseSubscriptionProps {
    userId: string;
    isSubscribed: boolean;
    initialSubscriberCount?: number;
    fromVideoId?: string;
}

export const useSubscription = ({
    userId,
    isSubscribed,
    initialSubscriberCount = 0,
    fromVideoId,
}: UseSubscriptionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const [isSubscribedState, setIsSubscribedState] = useState(isSubscribed);
    const [subscriberCountState, setSubscriberCountState] = useState(initialSubscriberCount);

    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess: () => {
            toast.success("Subscribed 🎉");
            setIsSubscribedState(true);
            setSubscriberCountState((count) => count + 1);
            utils.subscriptions.getMany.invalidate();
            utils.videos.getManySubscribed.invalidate();

            utils.users.getOne.invalidate({ id: userId });
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId });
            }
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: () => {
            toast.success("Unsubscribed 🎉");
            setIsSubscribedState(false);
            setSubscriberCountState((count) => Math.max(0, count - 1));
            utils.subscriptions.getMany.invalidate();
            utils.videos.getManySubscribed.invalidate();
            utils.users.getOne.invalidate({ id: userId });

            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId });
            }
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });

    const isPending = subscribe.isPending || unsubscribe.isPending;

    const onClick = () => {
        if (isSubscribedState) {
            unsubscribe.mutate({ userId });
        } else {
            subscribe.mutate({ userId });
        }
    };

    return {
        isPending,
        onClick,
        isSubscribed: isSubscribedState,
        subscriberCount: subscriberCountState,
    };
};