import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/clientApi";
import { notesKey } from "@/lib/queryKeys";
import NotesClient from "./Notes.client";

interface NotesFilterPageProps {
  params: { slug?: string[] };
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const tag = params.slug?.[0] ?? "all";

  const stableTag = tag === "all" ? "" : tag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: notesKey(1, "", 12, stableTag),
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag: stableTag || undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}