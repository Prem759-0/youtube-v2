import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type PlaylistGetManyOutput = inferRouterOutputs<AppRouter>["playlists"]["getMany"];
export type PlaylistGetManyForVideoOutput = inferRouterOutputs<AppRouter>["playlists"]["getManyForVideo"];
