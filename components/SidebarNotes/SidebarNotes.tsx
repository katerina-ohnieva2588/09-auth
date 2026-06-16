"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SidebarNotes.module.css";

const tags = ["all", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  const pathname = usePathname();

  return (
    <ul className={styles.menuList}>
      {tags.map((tag) => {
        const isAll = tag === "all";

        const href = isAll
          ? "/notes/filter/all"
          : `/notes/filter/${tag}`;

        const isActive = isAll
          ? pathname === "/notes/filter/all"
          : pathname.startsWith(`/notes/filter/${tag}`);

        return (
          <li key={tag} className={styles.menuItem}>
            <Link
              href={href}
              className={`${styles.menuLink} ${
                isActive ? styles.active : ""
              }`}
            >
              {isAll ? "All notes" : tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

