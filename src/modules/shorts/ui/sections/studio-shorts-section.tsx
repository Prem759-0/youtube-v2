'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { format } from 'date-fns';
import { BarChart3Icon, EyeIcon, MessageCircleIcon, ThumbsUpIcon } from 'lucide-react';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';

export const StudioShortsSection = () => (
	<Suspense fallback={<StudioShortsSkeleton />}>
		<ErrorBoundary fallback={<StudioShortsError />}>
			<StudioShortsSectionSuspense />
		</ErrorBoundary>
	</Suspense>
);

const StudioShortsSectionSuspense = () => {
	const router = useRouter();
	const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
		{ limit: DEFAULT_LIMIT * 2 },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor }
	);

	const items = videos.pages.flatMap((page) => page.items);

	if (!items.length) {
		return (
			<div className='mx-4 rounded-3xl border border-dashed p-10 text-center'>
				<h2 className='text-xl font-bold'>No Shorts-ready uploads yet</h2>
				<p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>Upload a vertical clip or pick any existing video to tune its thumbnail, visibility, title, and description for Shorts.</p>
			</div>
		);
	}

	return (
		<div className='space-y-5 px-4 pb-10'>
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
				{items.map((video) => (
					<button
						key={video.id}
						type='button'
						onClick={() => router.push(`/studio/video/${video.id}`)}
						className='group overflow-hidden rounded-3xl border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl'
					>
						<div className='grid grid-cols-[120px_1fr] gap-3 p-3 sm:grid-cols-[140px_1fr]'>
							<div className='relative aspect-[9/16] overflow-hidden rounded-2xl bg-secondary'>
								<Image src={video.thumbnailUrl ?? '/placeholder.svg'} alt={video.title} fill className='object-cover transition group-hover:scale-105' />
								<div className='absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur'>Short</div>
							</div>

							<div className='flex min-w-0 flex-col gap-3 py-1'>
								<div>
									<div className='mb-2 flex items-center gap-2'>
										<Badge variant={video.visibility === 'public' ? 'default' : 'secondary'}>{video.visibility}</Badge>
										<span className='text-xs text-muted-foreground'>{format(new Date(video.createdAt), 'MMM d, yyyy')}</span>
									</div>
									<h3 className='line-clamp-2 font-semibold leading-tight'>{video.title}</h3>
									<p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>{video.description || 'No description yet. Add a strong hook for the Shorts feed.'}</p>
								</div>

								<div className='mt-auto grid grid-cols-3 gap-2 text-xs text-muted-foreground'>
									<StudioShortMetric icon={<EyeIcon className='size-4' />} label='Views' value={video.viewCount} />
									<StudioShortMetric icon={<MessageCircleIcon className='size-4' />} label='Comments' value={video.commentCount} />
									<StudioShortMetric icon={<ThumbsUpIcon className='size-4' />} label='Likes' value={video.likeCount} />
								</div>
							</div>
						</div>
					</button>
				))}
			</div>

			<InfiniteScroll
				isManual
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</div>
	);
};

const StudioShortMetric = ({ icon, label, value }: { icon: ReactNode; label: string; value: number }) => (
	<div className='rounded-2xl bg-secondary/70 p-2'>
		<div className='flex items-center gap-1 font-semibold text-foreground'>
			{icon}
			{Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
		</div>
		<div>{label}</div>
	</div>
);

const StudioShortsSkeleton = () => (
	<div className='grid gap-4 px-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
		{Array.from({ length: 6 }).map((_, index) => (
			<div key={index} className='grid grid-cols-[120px_1fr] gap-3 rounded-3xl border p-3 sm:grid-cols-[140px_1fr]'>
				<Skeleton className='aspect-[9/16] rounded-2xl' />
				<div className='space-y-3 py-1'>
					<Skeleton className='h-5 w-24' />
					<Skeleton className='h-5 w-full' />
					<Skeleton className='h-16 w-full' />
					<Skeleton className='h-12 w-full' />
				</div>
			</div>
		))}
	</div>
);

const StudioShortsError = () => (
	<div className='mx-4 flex flex-col items-center justify-center rounded-3xl border p-10 text-center'>
		<BarChart3Icon className='size-10 text-red-600' />
		<h2 className='mt-3 text-xl font-bold'>Could not load Studio Shorts</h2>
		<p className='mt-2 text-sm text-muted-foreground'>Refresh the page and try again.</p>
	</div>
);
