import { ShortsFeedSection } from '../sections/shorts-feed-section';

export const ShortsView = () => (
	<div className='relative mx-auto max-w-[1400px] px-2 md:px-6'>
		<div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-background to-transparent' />
		<ShortsFeedSection />
	</div>
);
