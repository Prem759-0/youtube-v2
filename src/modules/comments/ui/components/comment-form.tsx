import { UserAvatar } from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import {Textarea} from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import  {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "sonner"
import {trpc} from "@/trpc/client"
import {commentsInsertSchema} from "@/db/schema"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"
import { Loader2Icon } from "lucide-react";


interface CommentFormProps {
    videoId: string;
    onSuccess?:()=>void
}

export const CommentForm = ({
    videoId, 
    onSuccess
}: CommentFormProps) => {
  const clerk = useClerk();
    const {user} = useUser();

    const utils = trpc.useUtils();
    const create = trpc.comments.create.useMutation({
      onSuccess:()=>{
        utils.comments.getMany.invalidate({videoId})
        form.reset();
        toast.success("Comment added ✅")
        onSuccess?.();
      },
      onError:(error)=>{
        if(error.data?.code === "UNAUTHORIZED"){
          clerk.openSignIn();
        }
        toast.error("Something went wrong")
      }
    });

    const formSchema = commentsInsertSchema.omit({ userId: true });
    type FormValues = z.infer<typeof formSchema>;

    const form  = useForm<FormValues>({
       resolver: zodResolver(formSchema),
       defaultValues:{
        videoId:videoId,
        value: "",
       },
    });

    const handleSubmit = (values: FormValues) => {
      if (!user) {
        clerk.openSignIn();
        return;
      }

      create.mutate(values);
    }
  
    return(
      <Form {...form}>
    <form
    onSubmit={form.handleSubmit(handleSubmit)}
    className="flex gap-4 group">
      <UserAvatar
        size="lg"
        imageUrl={user?.imageUrl || "/user.jpg"}
        name={user?.username || "User"}
      />
      <div className="flex-1 min-w-0">
        <FormField
         name="value"
         control={form.control}
         render={({field})=>(
          <FormItem>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  placeholder="Add a comment..."
                  className="resize-none bg-transparent overflow-x-hidden overflow-y-auto pb-10 max-h-[128px] min-h-0 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                />
                {(!!field.value.trim() || create.isPending) && (
                  <Button 
                    disabled={create.isPending} 
                    type="submit" 
                    size="sm"
                    className="absolute bottom-1.5 right-1.5 rounded-full"
                  >
                    {create.isPending ? <Loader2Icon className="animate-spin" /> : "Comment"}
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage/>
          </FormItem>
         )}
        />
      </div>
    </form>
      </Form>
  );
}

 