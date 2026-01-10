"use client"

import { ResponsiveModal } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { StudioUploader } from "./studio-uploader"


export const StudioUploadModal = () => {
    const utils = trpc.useUtils();
    const  create = trpc.videos.create.useMutation({
        onSuccess:()=>{
            toast.success("Video created 🎉")
            utils.studio.getMany.invalidate();
        },
        onError:()=>{
            toast.error("Video not created ‼️")
        }
    });

    return(
        <>
        <ResponsiveModal 
        open={!!create.data?.url}
        onOpenChange={()=> create.reset()} 
        title="Upload Video"
        >
           
           {create.data?.url 
           ? < StudioUploader  endpoint={create.data.url} onSuccess={() => {}}/>
            : <Loader2Icon/>
           } 

        </ResponsiveModal>
       <Button variant="secondary" onClick={()=> create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon/>}
        Create  
       </Button>
        </>
    )
}