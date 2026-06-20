"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import { notesKey } from "@/lib/queryKeys";
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
  const stableTag = tag === "all" ? "" : tag ?? "";

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { data, isError } = useQuery({
    queryKey: notesKey(page, debouncedSearch ?? "", perPage, stableTag),
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
        tag: stableTag || undefined,
      }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const hasNotes = notes.length > 0;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />

        {hasNotes && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isError && <p>Something went wrong</p>}

      {!isError && !hasNotes && <p>No notes found</p>}

      {hasNotes && <NoteList notes={notes} />}
    </div>
  );
}