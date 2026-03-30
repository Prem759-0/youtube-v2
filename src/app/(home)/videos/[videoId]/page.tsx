import { VideoView } from "@/modules/videos/ui/views/video-view";
import {trpc, HydrateClient} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/constants"

interface PageProps{
    params: Promise<{
        videoId: string;
    }>
}

const Page = async({params}: PageProps) => {
    const {videoId} = await params;

    void trpc.videos.getOne.prefetch({id:videoId});
    void trpc.comments.getMany.prefetchInfinite({videoId, limit: DEFAULT_LIMIT})
    return (
       <HydrateClient>
         <VideoView videoId={videoId} />
       </HydrateClient>
    )
}

export default Page;