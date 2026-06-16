import axios, { AxiosResponse } from "axios";
import type { Note } from "../types/note";

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

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return response.data;
};

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

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const response: AxiosResponse<FetchNotesResponse> =
    await api.get("/notes", { params });

  return response.data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", payload);
  return response.data;
};

export const deleteNote = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};