import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AuthSession } from "@/types/auth";

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async (params: FetchNotesParams) => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get("/notes", {
    headers: { Cookie },
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie },
  });

  return data;
};

export const getMe = async (): Promise<User> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get("/users/me", {
    headers: { Cookie },
  });

  return data;
};

export const checkSession = async (): Promise<AuthSession> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get<AuthSession>("/auth/session", {
    headers: { Cookie },
  });

  return data;
};