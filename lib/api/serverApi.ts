import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export const fetchNotes = async (): Promise<Note[]> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get("/notes", {
    headers: {
      Cookie,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie,
    },
  });

  return data;
};

export const getMe = async (): Promise<User> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie,
    },
  });

  return data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const Cookie = await getCookieHeader();

    const { data } = await api.get("/auth/session", {
      headers: {
        Cookie,
      },
    });

    return data;
  } catch {
    return null;
  }
};