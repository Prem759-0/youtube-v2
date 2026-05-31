import { VideoView } from "@/modules/videos/ui/views/video-view";
import {trpc, HydrateClient, getTRPCCaller} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/constants"
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps{
    params: Promise<{
        videoId: string;
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { videoId } = await params;
    try {
        const caller = getTRPCCaller();
        const video = await caller.videos.getOne({ id: videoId });
        return {
            title: video?.title ? `${video.title} - YouTube` : "YouTube",
        };
    } catch {
        return {
            title: "YouTube",
        };
    }
}

const Page = async({params}: PageProps) => {
    const {videoId} = await params;

    void trpc.videos.getOne.prefetch({id:videoId});
    void trpc.comments.getMany.prefetchInfinite({videoId, limit: DEFAULT_LIMIT});
    void trpc.suggestions.getMany.prefetchInfinite({videoId, limit: DEFAULT_LIMIT});
    return (
       <HydrateClient>
         <VideoView videoId={videoId} />
       </HydrateClient>
    )
}

export default Page;