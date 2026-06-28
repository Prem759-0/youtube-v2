'use client';

import { Suspense } from 'react';

import { TriangleAlertIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

import {  VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card';
import {  VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { PlaylistGridCard } from '../components/playlist-grid-card';

export const PlaylistsSection = () => {
	return (
		<Suspense fallback={<PlaylistsSectionSkeleton />}>
			<ErrorBoundary
				fallback={
					<p className='text-sm text-destructive'>
						<TriangleAlertIcon className='-mt-0.5 mr-1 inline size-4' /> Failed to fetch Playlists videos!
					</p>
				}
			>
				<PlaylistsSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	);
};

const PlaylistsSectionSkeleton = () => {
	return (
		<>
			<div className='flex flex-col gap-x-4 gap-y-10 md:hidden'>
				{Array.from({ length: 18 }).map((_, i) => (
					<VideoGridCardSkeleton key={i} />
				))}
			</div>

			<div className='hidden flex-col gap-4 md:flex'>
				{Array.from({ length: 18 }).map((_, i) => (
					<VideoRowCardSkeleton key={i} size='compact' />
				))}
			</div>
		</>
	);
};

const PlaylistsSectionSuspense = () => {
	const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	return (
		<>
			<div className='flex flex-col gap-x-4 gap-y-10 '>
				{playlists.pages
				   .flatMap((page) => page.items)
				   .map((playlist) => (
					<PlaylistGridCard
					  key={playlist.id}
					  data={playlist}
					/>
				   ))
				}
			</div>

		

			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</>
	);
}; 