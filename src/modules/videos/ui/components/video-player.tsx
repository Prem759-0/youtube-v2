"use client";

import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null;
  thumbnailUrl?: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay = false,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;

  return (
    <MuxPlayer 
      playbackId={playbackId} 
      poster={thumbnailUrl || "/placeholder.svg"} 
      playerInitTime={0} 
      autoPlay={autoPlay} 
      thumbnailTime={0} 
      className="w-full h-full" 
      accentColor="#FF2056" 
      onPlay={onPlay} 
      streamType="on-demand"
    />
  );
};
