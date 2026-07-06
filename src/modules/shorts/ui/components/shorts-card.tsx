'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import {
	MessageCircleIcon,
	MoreHorizontalIcon,
	PlayIcon,
	Share2Icon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	Volume2Icon,
	VolumeXIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import type { VideoGetManyOutput } from '@/modules/videos/types';

interface ShortsCardProps {
	video: VideoGetManyOutput['items'][number];
	index: number;
}

const formatCompact = (value: number) =>
	Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

export const ShortsCard = ({ video, index }: ShortsCardProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMuted, setIsMuted] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);

	const stats = useMemo(() => {
		const comments = Math.max(12, Math.round((video.viewCount + video.likeCount + index * 31) / 9));

		return {
			comments,
			shares: Math.max(4, Math.round(comments / 3)),
		};
	}, [index, video.likeCount, video.viewCount]);

	const togglePlayback = () => {
		const player = videoRef.current;

		if (!player || !video.previewUrl) return;

		if (player.paused) {
			void player.play();
			setIsPlaying(true);
		} else {
			player.pause();
			setIsPlaying(false);
		}
	};

	const toggleMute = () => {
		const nextMuted = !isMuted;
		setIsMuted(nextMuted);
		if (videoRef.current) {
			videoRef.current.muted = nextMuted;
		}
	};

	return (
		<article className='snap-start py-4 md:py-6'>
			<div className='mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-[520px] items-center justify-center gap-3 md:max-w-[640px]'>
				<div className='relative aspect-[9/16] h-[calc(100svh-8rem)] max-h-[760px] min-h-[560px] w-full max-w-[430px] overflow-hidden rounded-[2rem] bg-black shadow-2xl ring-1 ring-white/10'>
					<button
						type='button'
						onClick={togglePlayback}
						className='absolute inset-0 z-10 cursor-pointer'
						aria-label={isPlaying ? 'Pause short' : 'Play short'}
					>
						<span className='sr-only'>{isPlaying ? 'Pause short' : 'Play short'}</span>
					</button>

					{video.previewUrl ? (
						<video
							ref={videoRef}
							className='size-full object-cover'
							loop
							muted={isMuted}
							playsInline
							poster={video.thumbnailUrl ?? '/placeholder.svg'}
							src={video.previewUrl}
						/>
					) : (
						<Image src={video.thumbnailUrl ?? '/placeholder.svg'} alt={video.title} fill className='object-cover' />
					)}

					<div className='absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-black/80' />
					<div className='absolute left-4 right-4 top-4 z-20 flex items-center justify-between text-white'>
						<div className='rounded-full bg-black/35 px-3 py-1 text-sm font-semibold backdrop-blur'>Shorts</div>
						<Button type='button' variant='ghost' size='icon' onClick={toggleMute} className='rounded-full bg-black/35 text-white hover:bg-white/20 hover:text-white'>
							{isMuted ? <VolumeXIcon className='size-5' /> : <Volume2Icon className='size-5' />}
						</Button>
					</div>

					{!isPlaying && video.previewUrl && (
						<div className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'>
							<div className='rounded-full bg-black/45 p-5 text-white backdrop-blur'>
								<PlayIcon className='size-10 fill-white' />
							</div>
						</div>
					)}

					<div className='absolute bottom-0 left-0 right-0 z-20 p-4 text-white'>
						<Link prefetch href={`/users/${video.user.id}`} className='mb-3 flex w-fit items-center gap-2'>
							<UserAvatar imageUrl={video.user.imageUrl} name={video.user.name} size='sm' />
							<span className='text-sm font-semibold drop-shadow'>@{video.user.name}</span>
						</Link>
						<Link prefetch href={`/videos/${video.id}`} className='line-clamp-2 text-base font-semibold leading-tight drop-shadow'>
							{video.title}
						</Link>
						<p className='mt-2 line-clamp-2 text-sm text-white/85'>
							{formatCompact(video.viewCount)} views • Remix-ready vertical short • Tap to watch full video
						</p>
					</div>
				</div>

				<div className='hidden flex-col items-center gap-4 text-sm font-semibold md:flex'>
					<ShortsAction icon={<ThumbsUpIcon className='size-6' />} label={formatCompact(video.likeCount)} />
					<ShortsAction icon={<ThumbsDownIcon className='size-6' />} label='Dislike' />
					<ShortsAction icon={<MessageCircleIcon className='size-6' />} label={formatCompact(stats.comments)} />
					<ShortsAction icon={<Share2Icon className='size-6' />} label={formatCompact(stats.shares)} />
					<ShortsAction icon={<MoreHorizontalIcon className='size-6' />} label='More' />
				</div>
			</div>
		</article>
	);
};

interface ShortsActionProps {
	icon: ReactNode;
	label: string;
}

const ShortsAction = ({ icon, label }: ShortsActionProps) => (
	<button type='button' className={cn('flex flex-col items-center gap-1 text-foreground transition hover:text-red-600')}>
		<span className='flex size-12 items-center justify-center rounded-full bg-secondary shadow-sm'>{icon}</span>
		<span>{label}</span>
	</button>
);
