"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { noteKey } from "@/lib/queryKeys";

type Props = {
  id: string;
};

export default function NotePreview({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
  queryKey: noteKey(id),
  queryFn: () => fetchNoteById(id),
  });

  const formattedDate = data
    ? new Date(data.createdAt).toLocaleDateString()
    : "";

  return (
    <Modal onClose={() => router.back()}>
      <button onClick={() => router.back()}>Close</button>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}

      {!isLoading && !isError && data && (
        <>
          <h2>{data.title}</h2>
          <p>{data.content}</p>
          <p>{formattedDate}</p>
          <span>{data.tag}</span>
        </>
      )}
    </Modal>
  );
}