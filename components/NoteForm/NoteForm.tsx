"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";
import styles from "./NoteForm.module.css";

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (formData: FormData) => {
    mutation.mutate({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={styles.form} action={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={styles.input}
          type="text"
          defaultValue={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={styles.textarea}
          defaultValue={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={styles.select}
          defaultValue={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={mutation.isPending}
        >
          Create note
        </button>

        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}