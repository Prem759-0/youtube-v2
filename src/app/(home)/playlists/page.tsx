import { PlaylistsView } from "@/modules/playlists/ui/views/personal-view";
import { HydrateClient } from "@/trpc/server";

const Page = () => {
    return ( 
        <HydrateClient>
           <PlaylistsView/>
        </HydrateClient>
     );
}
 
export default Page;