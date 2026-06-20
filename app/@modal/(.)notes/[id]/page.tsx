import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/serverApi";
import { noteKey } from "@/lib/queryKeys";
import NotePreview from "./NotePreview.client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: noteKey(id),
    queryFn: () => fetchNoteById(id),
    staleTime: 1000 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}