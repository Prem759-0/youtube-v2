 "use client"

import { Button } from "@/components/ui/button";
import {PlusIcon} from "lucide-react"
 
 export const PlaylistsView = () => {
     return (
         <div className='mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5'>
            <div className="flex justify-between items-center">
             <div>
                 <h1 className='text-2xl font-bold'>Playlists</h1>
                 <p className='text-xl text-muted-foreground'>
                    Collections you have created
             </p>
             </div>
             <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={()=>{}}
             >
               <PlusIcon/>
             </Button>
            </div>
         </div>
     );
 };