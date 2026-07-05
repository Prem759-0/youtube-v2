"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import "@player.style/yt";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  muted?: boolean;
  loop?: boolean;
  startTime?: number;
  title?: string;
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  muted = false,
  loop = false,
  startTime,
  title,
}: VideoPlayerProps) => {
  const effectiveMuted = autoPlay ? true : muted;
  const [isBuffering, setIsBuffering] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* Let the YouTube player theme handle normal touch/click auto-hide behavior. */

        /* Fix icon sizes inside buttons on all screen sizes */
        mux-player media-captions-button svg,
        mux-player media-settings-menu-button svg,
        mux-player media-rendition-selectmenu svg {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
          min-height: 20px !important;
        }

        /* Fix settings menu not getting clipped on small screens */
        mux-player media-settings-menu {
          max-height: 70vh !important;
          overflow-y: auto !important;
          z-index: 100 !important;
        }

        /* Cinema mode prevention */
        mux-player[theater],
        mux-player[data-theater] {
          position: relative !important;
          inset: unset !important;
          transform: none !important;
          z-index: auto !important;
        }
      `}</style>

      <MuxPlayer
        theme="yt"
        playbackId={playbackId || ""}
        poster={thumbnailUrl || "/placeholder.svg"}
        autoPlay={autoPlay ? "muted" : false}
        accentColor="#FF2056"
        muted={effectiveMuted}
        loop={loop}
        startTime={startTime}
        title={title}
        streamType="on-demand"
        playbackRates={[0.5, 1, 1.25, 1.5, 2]}
        crossOrigin="anonymous"
        playsInline
        onLoadStart={() => setIsBuffering(true)}
        onWaiting={() => setIsBuffering(true)}
        onStalled={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => setIsBuffering(false)}
        onError={() => setIsBuffering(false)}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={(e: Event) => {
          const target = e.target as HTMLVideoElement;
          onTimeUpdate?.(target.currentTime);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      {isBuffering && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/20"
          role="status"
          aria-label="Loading video"
        >
          <div
            className="size-12 rounded-full border-[3px] border-white/25 border-t-[#FF0000] animate-spin"
            style={{ animationDuration: "0.75s" }}
          />
        </div>
      )}
    </div>
  );
};

export function YoutubeStyleLoader() {
  return (
    <div
      className="relative flex aspect-video w-full min-w-0 max-w-full items-center justify-center overflow-hidden bg-[#1f1f1f]"
      role="status"
      aria-busy="true"
      aria-label="Loading video player"
    >
      <div
        className="size-12 rounded-full border-[3px] border-white/15 border-t-[#FF0000] animate-spin"
        style={{ animationDuration: "0.75s" }}
      />
    </div>
  );
}

export const VideoPlayerSkeleton = YoutubeStyleLoader;
