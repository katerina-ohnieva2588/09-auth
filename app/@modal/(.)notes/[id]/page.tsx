import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import { noteKey } from "@/lib/queryKeys";
import NotePreview from "./NotePreview.client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: noteKey(id),
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}