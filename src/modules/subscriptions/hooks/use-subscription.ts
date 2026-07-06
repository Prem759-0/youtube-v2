import { useState, useEffect } from 'react';

import { useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

import { trpc } from '@/trpc/client';

interface UseSubscriptionProps {
	isSubscribed: boolean;
	userId: string;
	initialSubscriberCount?: number;
}

export const useSubscription = ({ isSubscribed, userId, initialSubscriberCount }: UseSubscriptionProps) => {
	const clerk = useClerk();
	const utils = trpc.useUtils();

	// Optimistic state for subscription status and subscriber count
	const [optimisticState, setOptimisticState] = useState({
		hasOptimisticUpdate: false,
		isSubscribed: isSubscribed,
		subscriberCount: initialSubscriberCount ?? 0,
	});

	// Sync optimistic state when props change, but only when there is no optimistic update
	useEffect(() => {
		if (
			!optimisticState.hasOptimisticUpdate &&
			(optimisticState.isSubscribed !== isSubscribed || optimisticState.subscriberCount !== (initialSubscriberCount ?? 0))
		) {
			setOptimisticState({
				hasOptimisticUpdate: false,
				isSubscribed: isSubscribed,
				subscriberCount: initialSubscriberCount ?? 0,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSubscribed, initialSubscriberCount]);

	const subscribe = trpc.subscriptions.create.useMutation({
		onError: (error) => {
			// Revert optimistic update on error
			setOptimisticState({
				hasOptimisticUpdate: false,
				isSubscribed: isSubscribed,
					subscriberCount: initialSubscriberCount ?? 0,
			});
			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn();
			} else {
				toast.error(error.message || 'Failed to subscribe this user!');
			}
		},
		onSuccess: async () => {
			setOptimisticState((currentState) => ({
				...currentState,
				hasOptimisticUpdate: false,
			}));
			await Promise.all([
				utils.videos.getOne.invalidate(),
				utils.videos.getManySubscribed.invalidate(),
				utils.subscriptions.getMany.invalidate(),
				utils.users.getOne.invalidate({ id: userId }),
			]);
		},
	});

	const unsubscribe = trpc.subscriptions.remove.useMutation({
		onError: (error) => {
			// Revert optimistic update on error
			setOptimisticState({
				hasOptimisticUpdate: false,
				isSubscribed: isSubscribed,
					subscriberCount: initialSubscriberCount ?? 0,
			});
			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn();
			} else {
				toast.error(error.message || 'Failed to unsubscribe this user!');
			}
		},
		onSuccess: async () => {
			setOptimisticState((currentState) => ({
				...currentState,
				hasOptimisticUpdate: false,
			}));
			await Promise.all([
				utils.videos.getOne.invalidate(),
				utils.videos.getManySubscribed.invalidate(),
				utils.subscriptions.getMany.invalidate(),
				utils.users.getOne.invalidate({ id: userId }),
			]);
		},
	});

	const onClick = () => {
		setOptimisticState((prevState) => {
			const wasSubscribed = prevState.isSubscribed;
			const newState = wasSubscribed
				? {
					  hasOptimisticUpdate: true,
					  isSubscribed: false,
					  subscriberCount: prevState.subscriberCount - 1,
				  }
				: {
					  hasOptimisticUpdate: true,
					  isSubscribed: true,
					  subscriberCount: prevState.subscriberCount + 1,
				  };

			// Trigger mutation based on previous state
			if (wasSubscribed) {
				unsubscribe.mutate({ userId });
			} else {
				subscribe.mutate({ userId });
			}

			return newState;
		});
	};

	return {
		isSubscribed: optimisticState.isSubscribed,
		onClick,
		subscriberCount: optimisticState.subscriberCount,
		isPending: subscribe.isPending || unsubscribe.isPending,
	};
};