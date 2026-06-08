import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
    compactViews: string;
    expandedViews: string;
    compactDate: string;
    expandedDate: string;
    description?: string | null;
}

export const VideoDescription = ({
    compactViews,
    expandedViews,
    compactDate,
    expandedDate,
    description,
}: VideoDescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
 
    return (
    <div
      onClick={()=> setIsExpanded((current)=>!current)}
      className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition"
    >
     <div className=" flex gap-2 text-sm mb-2">
        <span className="font-medium ">
          {isExpanded ? expandedViews : compactViews} views
        </span>
        <span className="font-medium ">
          {isExpanded ? expandedDate : compactDate} 
        </span>
     </div>
     <div className="relative">
       <p 
         className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-2",
         )}
       >
         {description || "No description"}
       </p>
       <div className="mt-4">
         <button onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((current)=>!current);
         }} className="justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 hover:bg-neutral-500/20 hover:text-accent-foreground flex items-center gap-1 rounded-full text-sm font-medium -ml-2">
          {isExpanded ? (
              <>
               Show less <ChevronUpIcon className="size-4" />
              </>
          ):(
              <>
               Show more <ChevronDownIcon className="size-4" /> 
              </>
          )}
         </button>
       </div>
     </div>
    </div>
    )
}