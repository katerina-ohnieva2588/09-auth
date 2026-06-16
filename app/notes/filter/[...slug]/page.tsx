import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { notesKey } from "@/lib/queryKeys";
import NotesClient from "./Notes.client";

interface NotesFilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesFilterPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0];

  const title = tag
    ? `Notes filtered by "${tag}" | NoteHub`
    : "All notes | NoteHub";

  const description = tag
    ? `Browse notes filtered by tag: ${tag}`
    : "Browse all notes";

  const url = tag
    ? `https://notehub.com/notes/filter/${tag}`
    : "https://notehub.com/notes/filter";

  return {
      title,
      description,
      openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://notehub.com/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0];

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