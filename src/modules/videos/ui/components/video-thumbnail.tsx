import Image from "next/image"

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  duration?: number;
  title?: string;
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? "/placeholder.svg"}
          alt={title ?? "Video thumbnail"}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        />

        <Image
          src={previewUrl ?? "/placeholder.svg"}
          alt={title ?? "Video preview"}
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
           {duration}
      </div>

    </div>
  )
}
