"use client";


import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface CategoriesSectionProps {
   categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
   return (
      <Suspense fallback={<CategoriesSkeleton />}>
         <ErrorBoundary fallback={<p>Error...</p>}>
            <CategoriesSectionSuspense categoryId={categoryId} />
         </ErrorBoundary>
      </Suspense>
   )
}

const CategoriesSkeleton = () => {
   return <FilterCarousel isLoading data={[]} onSelect={() => { }} />
}

export const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
   const router = useRouter();
   const [categories] = trpc.categories.getMany.useSuspenseQuery();

   const data = categories.map(({ name, id }) => ({
      value: id,
      label: name,
   }));

   const onSelect = (value: string | null) => {
      const url = new URL(window.location.href);

      if (value) {
         url.searchParams.set("categoryId", value);
      } else {
         url.searchParams.delete("categoryId");
      }

      router.push(url.toString())
   }

   return <FilterCarousel onSelect={onSelect} data={data} value={categoryId} />
}