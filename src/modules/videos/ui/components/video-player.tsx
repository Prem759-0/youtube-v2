"use client";

import MuxPlayer from "@mux/mux-player-react";
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
        /*
         * ROOT CAUSE: media-chrome adds breakpoint attributes (breakpointsm,
         * breakpointmd, etc.) to media-controller based on CONTAINER SIZE.
         * The YT theme uses these to hide buttons when player is "small".
         * 
         * FIX: Override every breakpoint state to force buttons always visible.
         * These CSS vars cascade into the shadow DOM via the custom property
         * inheritance mechanism — this is the ONLY way to style inside shadow DOM.
         */

        mux-player {
          /* Force all key buttons visible at ALL container sizes */
          --media-captions-button-display: inline-flex;
          --media-settings-menu-button-display: inline-flex;
          --media-rendition-selectmenu-display: inline-flex;
          --media-playback-rate-button-display: inline-flex;

          /* Prevent cinema mode */
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          display: block !important;
        }

        /*
         * The YT theme hides buttons at small/medium breakpoints.
         * Target EVERY breakpoint attribute state to force override.
         * media-controller gets breakpointsm / breakpointmd attrs when small.
         */
        mux-player media-controller,
        mux-player media-controller[breakpointsm],
        mux-player media-controller[breakpointmd],
        mux-player media-controller[breakpointlg],
        mux-player media-controller[breakpointxl] {
          --media-captions-button-display: inline-flex !important;
          --media-settings-menu-button-display: inline-flex !important;
          --media-rendition-selectmenu-display: inline-flex !important;
          --media-playback-rate-button-display: inline-flex !important;
        }

        /* Force the actual button elements visible regardless of theme hiding */
        mux-player media-captions-button,
        mux-player media-settings-menu-button,
        mux-player media-rendition-selectmenu {
          display: inline-flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        /* Fix icon sizes inside buttons on all screen sizes */
        mux-player media-captions-button svg,
        mux-player media-settings-menu-button svg,
        mux-player media-rendition-selectmenu svg {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
          min-height: 20px !important;
        }

        /* Ensure control bar doesn't clip/overflow-hide buttons */
        mux-player media-control-bar {
          overflow: visible !important;
          flex-wrap: wrap !important;
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
        defaultHiddenCaptions
        playsInline
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