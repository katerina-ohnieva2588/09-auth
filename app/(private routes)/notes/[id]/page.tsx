import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api/clientApi";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content?.slice(0, 150) || "Note details",
      openGraph: {
        title: note.title,
        description: note.content?.slice(0, 150) || "Note details",
        url: `https://notehub.com/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note not found | NoteHub",
      description: "This note does not exist.",
      openGraph: {
        title: "Note not found | NoteHub",
        description: "This note does not exist.",
        url: `https://notehub.com/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
      },
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <NoteDetailsClient id={id} />;
}