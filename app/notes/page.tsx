import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { notesKey } from "@/lib/queryKeys";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";

interface NotesFilterPageProps {
  params: { slug: string[] };
}

export default async function NotesFilterPage({ params }: NotesFilterPageProps) {
  const tag = params.slug?.[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: notesKey(1, "", 12, tag),
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}