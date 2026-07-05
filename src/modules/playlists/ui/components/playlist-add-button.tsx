'use client';

import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';

interface PlaylistAddButtonProps {
	playlist: {
		id: string;
		name: string;
		containsVideo?: boolean | null;
	};
	videoId: string;
	onSelectionChange?: () => void;
}

export const PlaylistAddButton = ({ playlist, videoId, onSelectionChange }: PlaylistAddButtonProps) => {
	const utils = trpc.useUtils();

	const addVideo = trpc.playlists.addVideo.useMutation({
		onError: (error) => {
			toast.error(error.message || 'Failed to add video to playlist!');
		},
		onSuccess: () => {
			utils.playlists.getMany.invalidate();
			utils.playlists.getManyForVideo.invalidate({ videoId });
			utils.playlists.getOne.invalidate({ id: playlist.id });
			utils.playlists.getVideos.invalidate({ playlistId: playlist.id });
		},
	});

	const removeVideo = trpc.playlists.removeVideo.useMutation({
		onError: (error) => {
			toast.error(error.message || 'Failed to remove video from playlist!');
		},
		onSuccess: () => {
			utils.playlists.getMany.invalidate();
			utils.playlists.getManyForVideo.invalidate({ videoId });
			utils.playlists.getOne.invalidate({ id: playlist.id });
			utils.playlists.getVideos.invalidate({ playlistId: playlist.id });
		},
	});

	const isPending = addVideo.isPending || removeVideo.isPending;

	const handleAction = () => {
		if (playlist.containsVideo) {
			removeVideo.mutate({ playlistId: playlist.id, videoId });
		} else {
			addVideo.mutate({ playlistId: playlist.id, videoId });
		}

		onSelectionChange?.();
	};

	return (
		<Button
			disabled={isPending}
			variant='ghost'
			className='w-full justify-start px-2 disabled:opacity-100 [&_svg]:size-5'
			size='lg'
			onClick={handleAction}
		>
			{isPending ? (
				<Loader2Icon
					className='animate-spin'
					aria-label={removeVideo.isPending ? 'Removing video from playlist...' : 'Adding video to playlist...'}
					strokeWidth={2.5}
				/>
			) : playlist.containsVideo ? (
				<SquareCheckIcon />
			) : (
				<SquareIcon />
			)}
			{playlist.name}
		</Button>
	);
};