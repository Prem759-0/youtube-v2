'use client';

import { Suspense } from 'react';

import { TriangleAlertIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';


import { Separator } from '@/components/ui/separator';
import { trpc } from '@/trpc/client';
import { UserPageBanner, UserPageBannerSkeleton } from '../components/user-page-banner';
import { UserPageInfo, UserPageInfoSkeleton } from '../components/user-page-info';

interface UserSectionProps {
	userId: string;
}

const UserSectionSkeleton = () => {
	return (
		<div className='flex flex-col'>
			<UserPageBannerSkeleton />
			<UserPageInfoSkeleton />
			<Separator />
		</div>
	);
};

export const UserSection = ({ userId }: UserSectionProps) => {
	return (
		<Suspense fallback={<UserSectionSkeleton />}>
			<ErrorBoundary
				fallback={
					<p className='text-sm text-destructive'>
						<TriangleAlertIcon className='-mt-0.5 mr-1 inline size-4' /> Failed to fetch user!
					</p>
				}
			>
				<UserSectionSuspense userId={userId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
	const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

	return (
		<div className='flex flex-col'>
			<UserPageBanner user={user} />
			<UserPageInfo user={user} />
			<Separator />
		</div>
	);
};