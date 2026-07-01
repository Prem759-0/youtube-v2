'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';

import { SubscriptionButton } from './subscription-button';
export const SubscriptionItemSkeleton = () => {
	return (
		<div className='flex items-start gap-4'>
			<Skeleton className='size-10 rounded-full' />

			<div className='flex-1'>
				<div className='flex items-center justify-between'>
					<div>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='mt-1 h-3 w-20' />
					</div>

					<Skeleton className='h-8 w-20' />
				</div>
			</div>
		</div>
	);
};

interface SubscriptionItemProps {
	name: string;
	imageUrl: string;
	subscriberCount: number;
	userId: string;
	onUnsubscribe: () => void;
	isLoading?: boolean;
}

export const SubscriptionItem = ({
	name,
	imageUrl,
	subscriberCount,
	userId,
	onUnsubscribe,
	isLoading = false,
}: SubscriptionItemProps) => {
	const compactSubscriberCount = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(subscriberCount);
	}, [subscriberCount]);

	return (
		<div className={cn('flex items-center justify-between gap-4 py-2', isLoading && 'animate-pulse')}>
			<Link prefetch href={`/users/${userId}`} className='flex min-w-0 items-center gap-4'>
				<UserAvatar size='lg' imageUrl={imageUrl} name={name} />
				<div className='min-w-0'>
					<h3 className='truncate font-medium'>{name}</h3>
					<p className='text-sm text-muted-foreground'>
						{compactSubscriberCount} subscriber{subscriberCount === 1 ? '' : 's'}
					</p>
				</div>
			</Link>

			<SubscriptionButton
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onUnsubscribe();
				}}
				disabled={isLoading}
				isSubscribed
			/>
		</div>
	);
};