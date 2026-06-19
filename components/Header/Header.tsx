import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <Link
        href="/"
        className={css.logo}
        aria-label="Go to Home page"
      >
        NoteHub
      </Link>

      <nav
        className={css.nav}
        aria-label="Main Navigation"
      >
        <ul className={css.navigation}>
          <li>
            <Link
              href="/"
              className={css.navigationLink}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/notes/filter/all"
              className={css.navigationLink}
            >
              Notes
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              className={css.navigationLink}
            >
              About
            </Link>
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}