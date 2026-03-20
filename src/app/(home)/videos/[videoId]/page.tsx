import { VideoView } from "@/modules/videos/ui/views/video-view";
import {trpc, HydrateClient} from "@/trpc/server";

interface PageProps{
    params: Promise<{
        videoId: string;
    }>
}

const Page = async({params}: PageProps) => {
    const {videoId} = await params;

    void trpc.videos.getOne.prefetch({id:videoId});
    void trpc.comments.getMany.prefeatch({videoId:videoId})
    return (
       <HydrateClient>
         <VideoView videoId={videoId} />
       </HydrateClient>
    )
}

export default Page;