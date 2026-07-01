
import { DEFAULT_LIMIT } from '@/constants';
import { SubscriptionsView } from '@/modules/home/ui/views/subscriptions-view';
import { HydrateClient, trpc } from '@/trpc/server';

const SubscriptionsPage = async () => {
	void trpc.subscriptions.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

	return (
		<HydrateClient>
			<SubscriptionsView />
		</HydrateClient>
	);
};

export default SubscriptionsPage;