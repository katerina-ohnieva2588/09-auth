"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch {
        clear();
      }
    };

    init();
  }, [setUser, clear]);

  return <>{children}</>;
}