import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export const getMe = async (): Promise<User> => {
  const Cookie = await getCookieHeader();

  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie },
  });

  return data;
};