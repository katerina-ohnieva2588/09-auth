"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";

import css from "./SignUpPage.module.css";
import { register, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const username = String(formData.get("username"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      await register({
        email,
        password,
        username,
      });

      const user = await getMe();
      setUser(user);

      router.push("/profile");
      router.refresh();
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;

      setError(
        err.response?.data?.error ||
          err.message ||
          "Registration failed"
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label>Username</label>
          <input name="username" type="text" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label>Email</label>
          <input name="email" type="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label>Password</label>
          <input name="password" type="password" className={css.input} required />
        </div>

        <button type="submit" className={css.submitButton}>
          Register
        </button>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}