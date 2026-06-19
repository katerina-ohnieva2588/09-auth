import { cookies } from "next/headers";
import { api, nextServer } from "@/lib/api/api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export const fetchNotes = async (params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

export const checkServerSession = async (): Promise<AxiosResponse<User>> => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await nextServer.get<User>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res;
};