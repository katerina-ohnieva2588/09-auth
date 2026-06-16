"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const [debouncedSearch] = useDebounce(searchInput, 400);

  const perPage = 12;
  const normalizedTag = tag === "all" ? undefined : tag;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { tag: normalizedTag, page, search: debouncedSearch }],
  queryFn: () =>
  fetchNotes({
    page,
    perPage,
    search: debouncedSearch,
    tag: normalizedTag,
  }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
        onChange={(value) => {
          setSearchInput(value);
          setPage(1);
          }}
        />

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Something went wrong</p>}

      {!isLoading && !isError && notes.length === 0 && (
        <p>No notes found</p>
      )}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} />
      )}
    </div>
  );
}