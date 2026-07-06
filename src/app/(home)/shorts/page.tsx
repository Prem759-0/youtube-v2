import { DEFAULT_LIMIT } from '@/constants';
import { ShortsView } from '@/modules/shorts/ui/views/shorts-view';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

const Page = () => {
	void trpc.videos.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT * 3 });

	return (
		<HydrateClient>
			<ShortsView />
		</HydrateClient>
	);
};

export default Page;
