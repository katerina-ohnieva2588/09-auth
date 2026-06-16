import type { Metadata } from "next";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "Сторінку не знайдено в NoteHub. Перевірте правильність URL.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "Сторінку не знайдено в NoteHub. Перевірте правильність URL.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Сторінку не знайдено в NoteHub. Перевірте правильність URL.
      </p>
    </main>
  );
}