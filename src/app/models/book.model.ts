export interface EditorialRef {
  id: number;
  user?: { name: string };
}

export interface AuthorRef {
  id: number;
  user?: { name: string };
}

export interface Book {
  id?: number;
  ISBN: string;
  title: string;
  subtitle?: string | null;
  publication_date?: string | null;
  number_pages?: number | null;
  genre?: string | null;
  editorial_id?: number | null;
  language?: string | null;
  synopsis?: string | null;
  image?: string | null;
  file?: string | null;
  author_id?: number;
  author?: AuthorRef;
  editorial?: EditorialRef;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: T[];
    total: number;
    per_page: number;
    last_page: number;
  };
}
