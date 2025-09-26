export interface Book {
  id: number;
  ISBN: string;
  title: string;
  image?: string;
  subtitle?: string;
  publication_date?: string;
  number_pages?: number;
  genre?: string;
  editorial?: string;
  id_author: number;
  language?: string;
  synopsis?: string;
}
