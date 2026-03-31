"use client"

import { CommentForm } from '@/modules/comments/ui/components/comment-form';
import { CommentItem } from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {DEFAULT_LIMIT} from "@/constants"
import { InfiniteScroll } from '@/components/infinite-scroll';

interface CommentsSectionProps{
    videoId: string;
}

export const CommentsSection = ({videoId}: CommentsSectionProps) => {
    return(
        <Suspense fallback={<p>Loading...</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
            <CommentsSectionSuspense videoId={videoId}/>
            </ErrorBoundary>
        </Suspense>
    )
}

const CommentsSectionSuspense = ({videoId}: CommentsSectionProps) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1>
                    0 Comments
                    </h1>
                    <CommentForm videoId={videoId}/>
                    <div className="flex flex-col gap-4 mt-2">
                      {comments.pages.flatMap((page)=>page.items).map((comment)=>(
                        <CommentItem
                        key={comment.id}
                        comment={comment}
                        />
                      ))}
                      <InfiniteScroll
                        hasNextPage={query.hasNextPage}
                        isFetchingNextPage={query.isFetchingNextPage}
                        fetchNextPage={query.fetchNextPage}
                      />
                    </div>
            </div>
        </div>
    )
}