import { VideoSection } from "../sections/video-section"
import {SuggestionsSection} from "../sections/suggestion-sections"
import {CommentsSection} from "../sections/comments-sections"

interface VideViewProps {
    videoId: string
}

export const VideoView = ({ videoId }: VideViewProps) => {
    return (
        <div className="flex flex-col max-ww-[1700px] mx-auto pt-2.5 px-4 mb-10">
           <div className="flex flex-col xl:flex-row gap-6">
             <div className="flex-1 min-w-0">
               <VideoSection videoId={videoId}/>
               <div className="xl:hidden block mt-4">
                <SuggestionsSection videoId={videoId} isManual />
               </div>
                <CommentsSection videoId={videoId}  />
             </div>
             <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
               <SuggestionsSection videoId={videoId}/>
             </div>
           </div>
        </div>
    )
}