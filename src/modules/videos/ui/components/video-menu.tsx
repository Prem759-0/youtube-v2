import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { APP_URL } from "@/constants";
import { useConfirm } from "@/hooks/use-confirm";
import { absoluteUrl } from "@/lib/utils";
import { PlaylistAddModal } from "@/modules/playlists/ui/components/playlist-add-modal";
import { useClerk } from "@clerk/nextjs";
import {ListPlusIcon, MoreVerticalIcon,  ShareIcon, Trash2Icon} from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";

interface VideoMenuProps {
    videoId: string;
    variant?: "ghost" | "secondary";
    onRemove?: () => void;
}

export const VideoMenu = ({
  videoId,
  variant = "ghost",
  onRemove,
}:VideoMenuProps) => {
     const { loaded, user, openSignIn } = useClerk();

	const [ConfirmDialog, confirm] = useConfirm({
		message: 'Are you sure you want to remove this video from playlist? This action cannot be undone.',
		title: 'Remove video from playlist',
	});

   const [openPlaylistAddModal, setOpenPlaylistAddModal] = useState(false);

	const fullUrl = absoluteUrl(`/videos/${videoId}`);

    const onShare =() => {
        const fullUrl = `${APP_URL 
    }/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to the clipboard")
    };

    	const handleOpenPlaylistAddModal = () => {
		if (loaded && !user) return openSignIn();

		setOpenPlaylistAddModal(true);
	};

	const handleRemove = async () => {
		if (!onRemove) return;

		const ok = await confirm();
		if (!ok) return;

		onRemove();
	};
 
    return (
        <>
        <ConfirmDialog />
        <PlaylistAddModal 
        open={openPlaylistAddModal} 
        onOpenChange={setOpenPlaylistAddModal} 
        videoId={videoId} 
        />
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size="icon" className="rounded-full">
                   <MoreVerticalIcon/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e)=> e.stopPropagation()}>
                <DropdownMenuItem onClick={onShare} >
                    <ShareIcon  className="mr-2 size-4"  />
                    Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenPlaylistAddModal} >
                    <ListPlusIcon  className="mr-2 size-4"  />
                    Add to playlist
                </DropdownMenuItem>
                {onRemove && (
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        void handleRemove();
                    }}
                >
                    <Trash2Icon className="mr-2 size-4" />
                    Remove
                </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
};