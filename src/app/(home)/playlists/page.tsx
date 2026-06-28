import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";

const Page = async () => {
   void trpc.playlists.getMany.prefetchInfinite({limit: DEFAULT_LIMIT});

    return ( 
        <HydrateClient>
           <PlaylistsView/>
        </HydrateClient>
     );
}
 
export default Page;