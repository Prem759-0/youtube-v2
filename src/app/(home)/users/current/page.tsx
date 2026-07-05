import { DEFAULT_LIMIT } from '@/constants';
import { UserView } from '@/modules/users/ui/views/user-view';
import { HydrateClient, trpc } from '@/trpc/server';

const CurrentUserPage = async () => {
	void trpc.users.getOne.prefetch({ id: 'current' });
	void trpc.videos.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT, userId: 'current' });

	return (
		<HydrateClient>
			<UserView userId="current" />
		</HydrateClient>
	);
};

export default CurrentUserPage;
