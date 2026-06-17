
import { DEFAULT_LIMIT } from '@/constants';
import { SubscribedView } from '@/modules/home/ui/views/subscribed-view';
import { TrendingView } from '@/modules/home/ui/views/trending-view';
import { trpc, HydrateClient } from '@/trpc/server';

export const dynamic = "force-dynamic"



 const Page = async () => {
  
  void trpc.videos.getManySubscribed.prefetchInfinite({ limit: DEFAULT_LIMIT});
   
  return (
    <HydrateClient>
        <SubscribedView/>
      </HydrateClient>
  );
}
                    
export default Page;