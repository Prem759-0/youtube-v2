import { ResponsiveModal } from "@/components/responsive-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import {
    Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import z from "zod";

interface ThumbnailGenerateModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(10),
})

export const ThumbnailGenerateModal = ({
    videoId,
    open,
    onOpenChange,
}: ThumbnailGenerateModalProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        }
    });

    

      const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {description: "this may take some time"});
      form.reset()
      onOpenChange(false)
    },
    onError:()=>{
      toast.error("Something went wrong ❌")
    }
  });
 
    const  onSubmit = (values: z.infer<typeof formSchema>) => {
       generateThumbnail.mutate({
        prompt: values.prompt,
        id: videoId,
       })
    }
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Upload a thumbnail"
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                >
                    <FormField
                    control={form.control}
                    name="prompt"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Prompt</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="resize-none"
                                    cols={30}
                                    rows={5}
                                    placeholder="A description of wanted thumbnail"
                                />
                            </FormControl>
                            <FormMessage /> 
                        </FormItem>
                    )}
                    />
                     <div className="flex justify-end">
                        <Button
                        disabled={generateThumbnail.isPending}
                          type="submit"
                        >
                            Generate
                        </Button>
                     </div>
                    
                </form>
            </Form>
        </ResponsiveModal>
    )
}