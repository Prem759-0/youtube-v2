import { DEFAULT_LIMIT } from '@/constants';
import { StudioShortsView } from '@/modules/shorts/ui/views/studio-shorts-view';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

const Page = () => {
	void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT * 2 });

	return (
		<HydrateClient>
			<StudioShortsView />
		</HydrateClient>
	);
};

export default Page;
