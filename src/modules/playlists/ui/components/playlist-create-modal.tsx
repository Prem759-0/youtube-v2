import { ResponsiveModal } from "@/components/responsive-dialog";
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
import { useRouter } from "next/navigation";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";


interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(1),
})

export const PlaylistCreateModal = ({
    open,
    onOpenChange,
}: PlaylistCreateModalProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    });

    

      const utils = trpc.useUtils();

      const create = trpc.playlists.create.useMutation({
onSuccess: () => {
      toast.success("Playlist created 🎉 ");
      form.reset();
      onOpenChange(false);
      utils.playlists.getMany.invalidate();
      router.refresh();
    },
    onError:()=>{
      toast.error("Something went wrong ❌")
    }
  });
 
    const  onSubmit = (values: z.infer<typeof formSchema>) => {
       create.mutate(values)
    }
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Create a Playlist"
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                >
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="My favorite videos"
                                />
                            </FormControl>
                            <FormMessage /> 
                        </FormItem>
                    )}
                    />
                     <div className="flex justify-end">
                        <Button
                        disabled={create.isPending}
                          type="submit"
                          className="rounded-full"
                        >
                            {create.isPending ? (
                              <Loader2Icon className="animate-spin" />
                            ) : (
                              <>Create</>
                            )}
                        </Button>
                     </div>
                    
                </form>
            </Form>
        </ResponsiveModal>
    )
}