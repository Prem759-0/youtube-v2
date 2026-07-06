'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClapperboardIcon, Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { ShortsCard } from '../components/shorts-card';

export const ShortsFeedSection = () => (
	<Suspense fallback={<ShortsFeedSkeleton />}>
		<ErrorBoundary fallback={<ShortsFeedError />}>
			<ShortsFeedSectionSuspense />
		</ErrorBoundary>
	</Suspense>
);

const ShortsFeedSectionSuspense = () => {
	const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
		{ limit: DEFAULT_LIMIT * 3 },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor }
	);

	const items = videos.pages.flatMap((page) => page.items);

	return (
		<div className='h-[calc(100svh-4rem)] snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth pb-6'>
			{items.map((video, index) => (
				<ShortsCard key={video.id} video={video} index={index} />
			))}

			<div className='flex snap-start justify-center py-8'>
				<Button disabled={!query.hasNextPage || query.isFetchingNextPage} onClick={() => query.fetchNextPage()} className='rounded-full'>
					{query.isFetchingNextPage ? <Loader2Icon className='mr-2 size-4 animate-spin' /> : null}
					{query.hasNextPage ? 'Load more Shorts' : 'You are all caught up'}
				</Button>
			</div>
		</div>
	);
};

const ShortsFeedSkeleton = () => (
	<div className='flex h-[calc(100svh-4rem)] items-center justify-center'>
		<div className='aspect-[9/16] h-[70svh] max-h-[720px] animate-pulse rounded-[2rem] bg-secondary' />
	</div>
);

const ShortsFeedError = () => (
	<div className='flex h-[calc(100svh-4rem)] flex-col items-center justify-center gap-3 text-center'>
		<ClapperboardIcon className='size-10 text-red-600' />
		<h2 className='text-xl font-bold'>Shorts could not load</h2>
		<p className='max-w-md text-sm text-muted-foreground'>Please refresh and try again.</p>
	</div>
);
