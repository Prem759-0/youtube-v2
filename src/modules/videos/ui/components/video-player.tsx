"use client";

import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
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
      autoPlay={autoPlay}
      className="w-full h-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
      streamType="on-demand"
      playbackRates={[0.5, 1, 1.25, 1.5, 2]}
      crossOrigin="anonymous"
    />

  );
};