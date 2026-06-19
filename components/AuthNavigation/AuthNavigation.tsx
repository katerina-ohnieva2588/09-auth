"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import css from "./AuthNavigation.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { logout as apiLogout } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, user, clearIsAuthenticated } =
    useAuthStore();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await apiLogout();
    } catch (error) {
      console.error(error);
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
      setLoading(false);
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Register
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <span className={css.navigationLink}>
              {user?.email}
            </span>
          </li>

          <li className={css.navigationItem}>
            <Link href="/profile" className={css.navigationLink}>
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <button
              type="button"
              onClick={handleLogout}
              className={css.logoutButton}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </li>
        </>
      )}
    </>
  );
}