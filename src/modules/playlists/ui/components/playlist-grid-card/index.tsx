import Link  from "next/link";
import { PlaylistGetManyOutput } from "@/modules/playlists/types"

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCard = ({
   data,
}: PlaylistGridCardProps) => {
    return (
        <Link href={`/playlists/${data.id}`}>
          <div className="flex flex-col gap-2 w-full group">
             {data.name}
          </div>
        </Link>
    )
}
  
