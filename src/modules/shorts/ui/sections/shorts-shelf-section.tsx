'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClapperboardIcon } from 'lucide-react';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';

export const ShortsShelfSection = () => (
	<Suspense fallback={<ShortsShelfSkeleton />}>
		<ErrorBoundary fallback={null}>
			<ShortsShelfSectionSuspense />
		</ErrorBoundary>
	</Suspense>
);

const ShortsShelfSectionSuspense = () => {
	const [videos] = trpc.videos.getMany.useSuspenseInfiniteQuery(
		{ limit: DEFAULT_LIMIT },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor }
	);

	const items = videos.pages.flatMap((page) => page.items).slice(0, 5);

	if (!items.length) return null;

	return (
		<section className='space-y-3'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<ClapperboardIcon className='size-6 fill-red-600 text-red-600' />
					<h2 className='text-xl font-bold'>Shorts</h2>
				</div>
				<Link prefetch href='/shorts' className='text-sm font-semibold text-red-600 hover:underline'>
					View all
				</Link>
			</div>

			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
				{items.map((video) => (
					<Link key={video.id} prefetch href='/shorts' className='group space-y-2'>
						<div className='relative aspect-[9/16] overflow-hidden rounded-2xl bg-secondary shadow-sm transition group-hover:scale-[1.02] group-hover:shadow-lg'>
							<Image src={video.thumbnailUrl ?? '/placeholder.svg'} alt={video.title} fill className='object-cover' />
							<div className='absolute inset-0 bg-linear-to-b from-transparent to-black/65' />
							<div className='absolute bottom-3 left-3 right-3 text-white'>
								<p className='line-clamp-2 text-sm font-semibold drop-shadow'>{video.title}</p>
								<p className='mt-1 text-xs text-white/80'>{Intl.NumberFormat('en', { notation: 'compact' }).format(video.viewCount)} views</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

const ShortsShelfSkeleton = () => (
	<section className='space-y-3'>
		<div className='h-7 w-28 animate-pulse rounded bg-secondary' />
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
			{Array.from({ length: 5 }).map((_, index) => (
				<div key={index} className='aspect-[9/16] animate-pulse rounded-2xl bg-secondary' />
			))}
		</div>
	</section>
);
