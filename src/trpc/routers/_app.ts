import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { playlistsRouter } from "@/modules/playlists/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { videoViewRouter } from "@/modules/video-views/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import {videoReactionsRouter} from "@/modules/video-reactions/server/procedures"
import { suggestionsRouter } from "@/modules/suggestions/server/procedures";
import { commentReactionsRouter } from "@/modules/comment-reactions copy/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  search: searchRouter,
  comments: commentsRouter,
  playlists: playlistsRouter,
  categories: categoriesRouter,
  videoViews: videoViewRouter,
  subscriptions: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
  suggestions: suggestionsRouter,
  commentReactions: commentReactionsRouter,
});

export type AppRouter = typeof appRouter;