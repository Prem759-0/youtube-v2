import {Sidebar, SidebarContent} from "@/components/ui/sidebar"
import {MainSection} from "./main-section" 
import {PersonalSection} from "./personal-section" 
import { SignedIn } from '@clerk/nextjs';
import { SubscriptionsItems } from "./subscriptions-items";
import { Separator } from "@/components/ui/separator";
import { OtherItems } from "./other-items";

export const HomeSidebar = () => {
    return(
        <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
           <SidebarContent className="bg-background">
              <MainSection/>
              <Separator/>
              <PersonalSection/>
              <SignedIn>
					<>
						<Separator />
						<SubscriptionsItems />
					</>
				</SignedIn>

				<OtherItems />
           </SidebarContent>
        </Sidebar>
    )
}