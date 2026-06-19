import { api } from "./api";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search?.trim()) params.search = search.trim();
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
};

export const deleteNote = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/notes/${id}`);
  return data;
};

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SessionResponse {
  success: boolean;
}

export const register = async (data: RegisterPayload): Promise<User> => {
  const { data: user } = await api.post<User>("/auth/register", data);
  return user;
};

export const login = async (data: LoginPayload): Promise<User> => {
  const { data: user } = await api.post<User>("/auth/login", data);
  return user;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const { data } = await api.get<SessionResponse>("/auth/session");
    return data.success;
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (
  data: Partial<User>
): Promise<User> => {
  const { data: user } = await api.patch<User>("/users/me", data);
  return user;
};