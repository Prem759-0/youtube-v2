
import { trpc, HydrateClient } from '@/trpc/server';
import { PageClient } from './client';
import {Suspense} from "react";
import { ErrorBoundary } from 'react-error-boundary';

export default async function Home() {
   void trpc.hello.prefetch({text: "webdev123"});
   
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}/>
      <ErrorBoundary fallback={<p>Error...</p>}>
       <PageClient/>
      </ErrorBoundary>
      </HydrateClient>
  );
}
                    