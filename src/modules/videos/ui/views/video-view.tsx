import { VideoSection } from "../sections/video-section"
import {SuggestionsSection} from "../sections/suggestion-sections"
import {CommentsSection} from "../sections/comments-sections"

interface VideViewProps {
    videoId: string
}

export const VideoView = ({ videoId }: VideViewProps) => {
    return (
        <div className="flex flex-col max-w-[2400px] mx-auto pt-2.5 px-4 mb-10">
           <div className="flex flex-col lg:flex-row gap-6">
             <div className="flex-1 min-w-0">
               <VideoSection videoId={videoId}/>
               <div className="lg:hidden block mt-4">
                <SuggestionsSection videoId={videoId} isManual />
               </div>
                <CommentsSection videoId={videoId}  />
             </div>
             <div className="hidden lg:block w-full lg:w-[350px] xl:w-[380px] 2xl:w-[460px] min-[1800px]:w-[500px] shrink-0">
               <SuggestionsSection videoId={videoId}/>
             </div>
           </div>
        </div>
    )
}