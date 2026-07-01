'use client';

import { Suspense } from 'react';

import { TriangleAlertIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import {
	SubscriptionItem,
	SubscriptionItemSkeleton,
} from '@/modules/subscriptions/ui/components/subscription-list-item';
import { trpc } from '@/trpc/client';

export const SubscriptionsSection = () => {
	return (
		<Suspense fallback={<SubscriptionsSectionSkeleton />}>
			<ErrorBoundary
				fallback={
					<p className='text-sm text-destructive'>
						<TriangleAlertIcon className='-mt-0.5 mr-1 inline size-4' /> Failed to fetch subscriptions!
					</p>
				}
			>
				<SubscriptionsSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	);
};

const SubscriptionsSectionSkeleton = () => {
	return (
		<div className='flex flex-col'>
			{Array.from({ length: 8 }).map((_, i) => (
				<SubscriptionItemSkeleton key={i} />
			))}
		</div>
	);
};

const SubscriptionsSectionSuspense = () => {
	const utils = trpc.useUtils();

	const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	const unsubscribe = trpc.subscriptions.remove.useMutation({
		onError: (error) => {
			toast.error(error.message || 'Failed to unsubscribe this user!');
		},
		onSuccess: (data) => {
			toast.success('Unsubscribed');
			utils.videos.getManySubscribed.invalidate();
			utils.subscriptions.getMany.invalidate();
			utils.users.getOne.invalidate({ id: data.creatorId });
		},
	});

	const items = subscriptions.pages.flatMap((page) => page.items);

	if (items.length === 0) {
		return <p className='text-sm text-muted-foreground'>You have not subscribed to any channels yet.</p>;
	}

	return (
		<>
			<div className='flex flex-col'>
				{items.map((subscription) => (
					<SubscriptionItem
						key={subscription.creatorId}
						name={subscription.user.name}
						imageUrl={subscription.user.imageUrl}
						subscriberCount={subscription.user.subscriberCount}
						userId={subscription.user.id}
						onUnsubscribe={() => {
							unsubscribe.mutate({ userId: subscription.creatorId });
						}}
						isLoading={unsubscribe.isPending}
					/>
				))}
			</div>

			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</>
	);
};
