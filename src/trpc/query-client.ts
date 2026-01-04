import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
//import superjson from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
      },
      dehydrate: {
        // serialize data on the server
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // deserialize data on the client
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
