import { fetchNoteById } from "@/lib/api/serverApi";

export const getNoteById = (id: string) => fetchNoteById(id);