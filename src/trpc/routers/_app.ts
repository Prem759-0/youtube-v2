import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { videoViewRouter } from "@/modules/video-views/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import {videoReactionsRouter} from "@/modules/video-reactions/server/procedures"
import { createTRPCRouter } from "../init";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  comments: commentsRouter,
  categories: categoriesRouter,
  videoViews: videoViewRouter,
  subscriptions: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
});

export type AppRouter = typeof appRouter;