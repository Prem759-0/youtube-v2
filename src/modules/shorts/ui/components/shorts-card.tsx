'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import {
	ExternalLinkIcon,
	MessageCircleIcon,
	MoreHorizontalIcon,
	PlayIcon,
	Share2Icon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	Volume2Icon,
	VolumeXIcon,
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import type { AppRouter } from '@/trpc/routers/_app';
import { trpc } from '@/trpc/client';
import type { inferRouterOutputs } from '@trpc/server';

interface ShortsCardProps {
	video: inferRouterOutputs<AppRouter>['videos']['getMany']['items'][number];
	index: number;
}

const formatCompact = (value: number) =>
	Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

export const ShortsCard = ({ video, index }: ShortsCardProps) => {
	const clerk = useClerk();
	const utils = trpc.useUtils();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMuted, setIsMuted] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);
	const [reactionState, setReactionState] = useState({
		likes: video.likeCount,
		dislikes: video.dislikeCount,
		viewerReaction: video.viewerReaction,
	});

	const shares = useMemo(() => Math.max(4, Math.round((video.commentCount + index * 7) / 3)), [index, video.commentCount]);

	const like = trpc.videoReactions.like.useMutation({
		onSuccess: () => {
			utils.videos.getMany.invalidate();
			utils.playlists.getLiked.invalidate();
		},
		onError: (error) => {
			setReactionState({ likes: video.likeCount, dislikes: video.dislikeCount, viewerReaction: video.viewerReaction });
			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn();
			} else {
				toast.error('Could not like this Short');
			}
		},
	});

	const dislike = trpc.videoReactions.dislike.useMutation({
		onSuccess: () => {
			utils.videos.getMany.invalidate();
		},
		onError: (error) => {
			setReactionState({ likes: video.likeCount, dislikes: video.dislikeCount, viewerReaction: video.viewerReaction });
			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn();
			} else {
				toast.error('Could not dislike this Short');
			}
		},
	});

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

	const handleLike = () => {
		setReactionState((current) => ({
			likes: current.viewerReaction === 'like' ? current.likes - 1 : current.likes + 1,
			dislikes: current.viewerReaction === 'dislike' ? Math.max(0, current.dislikes - 1) : current.dislikes,
			viewerReaction: current.viewerReaction === 'like' ? null : 'like',
		}));
		like.mutate({ videoId: video.id });
	};

	const handleDislike = () => {
		setReactionState((current) => ({
			likes: current.viewerReaction === 'like' ? Math.max(0, current.likes - 1) : current.likes,
			dislikes: current.viewerReaction === 'dislike' ? current.dislikes - 1 : current.dislikes + 1,
			viewerReaction: current.viewerReaction === 'dislike' ? null : 'dislike',
		}));
		dislike.mutate({ videoId: video.id });
	};

	const handleShare = async () => {
		const url = `${window.location.origin}/videos/${video.id}`;

		if (navigator.share) {
			await navigator.share({ title: video.title, url });
			return;
		}

		await navigator.clipboard.writeText(url);
		toast.success('Short link copied');
	};

	return (
		<article className='snap-start py-3 sm:py-4 md:py-6'>
			<div className='mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-[680px] grid-cols-1 place-items-center gap-3 px-2 md:grid-cols-[minmax(280px,430px)_72px] md:px-0'>
				<div className='relative aspect-[9/16] h-[min(78svh,760px)] min-h-[420px] w-full max-w-[430px] overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10 max-[380px]:min-h-[360px] sm:rounded-[2rem]'>
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

					<div className='absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/85' />
					<div className='absolute left-3 right-3 top-3 z-20 flex items-center justify-between text-white sm:left-4 sm:right-4 sm:top-4'>
						<div className='rounded-full bg-black/35 px-3 py-1 text-sm font-semibold backdrop-blur'>Shorts</div>
						<Button type='button' variant='ghost' size='icon' onClick={toggleMute} className='relative z-30 rounded-full bg-black/35 text-white hover:bg-white/20 hover:text-white'>
							{isMuted ? <VolumeXIcon className='size-5' /> : <Volume2Icon className='size-5' />}
						</Button>
					</div>

					{!isPlaying && video.previewUrl && (
						<div className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'>
							<div className='rounded-full bg-black/45 p-4 text-white backdrop-blur sm:p-5'>
								<PlayIcon className='size-8 fill-white sm:size-10' />
							</div>
						</div>
					)}

					<div className='absolute bottom-0 left-0 right-0 z-20 p-3 text-white sm:p-4'>
						<Link prefetch href={`/users/${video.user.id}`} className='relative z-30 mb-3 flex w-fit items-center gap-2'>
							<UserAvatar imageUrl={video.user.imageUrl} name={video.user.name} size='sm' />
							<span className='text-sm font-semibold drop-shadow'>@{video.user.name}</span>
						</Link>
						<Link prefetch href={`/videos/${video.id}`} className='relative z-30 line-clamp-2 text-base font-semibold leading-tight drop-shadow'>
							{video.title}
						</Link>
						<p className='mt-2 line-clamp-2 text-sm text-white/85'>
							{formatCompact(video.viewCount)} views • {formatCompact(video.commentCount)} comments • Tap to watch full video
						</p>
					</div>

					<div className='absolute bottom-24 right-3 z-30 flex flex-col items-center gap-3 text-xs font-semibold text-white md:hidden'>
						<ShortsAction active={reactionState.viewerReaction === 'like'} icon={<ThumbsUpIcon className='size-5' />} label={formatCompact(reactionState.likes)} onClick={handleLike} />
						<ShortsAction active={reactionState.viewerReaction === 'dislike'} icon={<ThumbsDownIcon className='size-5' />} label='Dislike' onClick={handleDislike} />
						<ShortsAction asChild icon={<MessageCircleIcon className='size-5' />} label={formatCompact(video.commentCount)} href={`/videos/${video.id}#comments`} />
						<ShortsAction icon={<Share2Icon className='size-5' />} label='Share' onClick={handleShare} />
					</div>
				</div>

				<div className='hidden flex-col items-center gap-4 text-sm font-semibold md:flex'>
					<ShortsAction active={reactionState.viewerReaction === 'like'} icon={<ThumbsUpIcon className='size-6' />} label={formatCompact(reactionState.likes)} onClick={handleLike} />
					<ShortsAction active={reactionState.viewerReaction === 'dislike'} icon={<ThumbsDownIcon className='size-6' />} label='Dislike' onClick={handleDislike} />
					<ShortsAction asChild icon={<MessageCircleIcon className='size-6' />} label={formatCompact(video.commentCount)} href={`/videos/${video.id}#comments`} />
					<ShortsAction icon={<Share2Icon className='size-6' />} label={formatCompact(shares)} onClick={handleShare} />
					<ShortsAction asChild icon={<ExternalLinkIcon className='size-6' />} label='Watch' href={`/videos/${video.id}`} />
					<ShortsAction icon={<MoreHorizontalIcon className='size-6' />} label='More' onClick={() => toast.info('More Shorts tools coming soon')} />
				</div>
			</div>
		</article>
	);
};

interface ShortsActionProps {
	active?: boolean;
	asChild?: boolean;
	href?: string;
	icon: ReactNode;
	label: string;
	onClick?: () => void;
}

const ShortsAction = ({ active = false, asChild = false, href = '#', icon, label, onClick }: ShortsActionProps) => {
	const className = cn('flex flex-col items-center gap-1 transition hover:text-red-600', active && 'text-red-600');
	const bubbleClassName = cn('flex size-11 items-center justify-center rounded-full bg-black/35 shadow-sm backdrop-blur md:size-12 md:bg-secondary', active && 'bg-red-600 text-white md:bg-red-100 md:text-red-600');

	if (asChild) {
		return (
			<Link prefetch href={href} className={className}>
				<span className={bubbleClassName}>{icon}</span>
				<span>{label}</span>
			</Link>
		);
	}

	return (
		<button type='button' className={className} onClick={onClick}>
			<span className={bubbleClassName}>{icon}</span>
			<span>{label}</span>
		</button>
	);
};
