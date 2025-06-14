export interface Book {
  id: string;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  thumbnail: string;
  pageCount: number;
  categories: string[];
  status: 'unread' | 'reading' | 'completed';
  addedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface BookSearchResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}