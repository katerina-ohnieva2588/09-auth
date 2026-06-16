export const notesKey = (
  page: number,
  search: string,
  perPage: number,
  tag?: string
) => ["notes", page, search, perPage, tag] as const;

export const noteKey = (id: string) => ["note", id] as const;