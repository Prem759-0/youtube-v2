import { StudioShortsSection } from '../sections/studio-shorts-section';

export const StudioShortsView = () => (
	<div className='flex flex-col gap-y-6 pt-2.5'>
		<div className='px-4'>
			<h1 className='text-2xl font-bold'>Channel Shorts</h1>
			<p className='text-sm text-muted-foreground'>Manage vertical Shorts packaging, performance, comments, likes, and visibility from one responsive dashboard.</p>
		</div>
		<StudioShortsSection />
	</div>
);
