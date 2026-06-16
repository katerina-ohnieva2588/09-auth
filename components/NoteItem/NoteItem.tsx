import css from "./NoteItem.module.css";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  content: string;
  tag: string;
  onDelete: (id: string) => void;
};

export default function NoteItem({
  id,
  title,
  content,
  tag,
  onDelete,
}: Props) {
  return (
    <div className={css.item}>
      <div className={css.header}>
        <h3>{title}</h3>
      </div>

      <p className={css.tag}>{tag}</p>
      <p className={css.content}>{content}</p>

      <div className={css.actions}>
        <Link href={`/notes/${id}`}>View details</Link>

        <button onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
}