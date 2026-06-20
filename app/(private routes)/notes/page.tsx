import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import { notesKey } from "@/lib/queryKeys";
import NotesClient from "@/app/(private routes)/notes/filter/[...slug]/Notes.client";

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesFilterPage({ params }: NotesFilterPageProps) {
  const { slug } = await params;

  const tag = slug?.[0] ?? "all";
  const stableTag = tag === "all" ? "" : tag;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });

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