import {cn} from "@/lib/utils"
import {Button, ButtonProps} from "@/components/ui/button"

interface SubscriptionButtonProps{
    onClick:ButtonProps["onClick"];
    disabled?:boolean;
    isLoading?: boolean;
    isSubscribed?:boolean;
    className?: string;
    size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
    onClick,
    disabled,
    isLoading,
    isSubscribed,
    className,
    size,
}: SubscriptionButtonProps) =>{
   return(
    <Button
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
   )
}
