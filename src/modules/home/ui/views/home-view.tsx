
import { CategoriesSection } from '../sections/categories-section';
import { HomeVideosSection } from '../sections/home-videos-section';
import { ShortsShelfSection } from '@/modules/shorts/ui/sections/shorts-shelf-section';

interface HomeViewProps {
   categoryId?: string;
}

const HomeView = ({
   categoryId,
}: HomeViewProps) => {
   return (
      <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 ">
         <CategoriesSection categoryId={categoryId} />
         {!categoryId && <ShortsShelfSection />}
         <HomeVideosSection categoryId={categoryId} />
      </div>
   )
}

export default HomeView
