import type { BookSearchResult } from '../types/book';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export class BookApiService {
  async searchByISBN(isbn: string): Promise<BookSearchResult[]> {
    try {
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      const response = await fetch(`${GOOGLE_BOOKS_API_BASE}?q=isbn:${cleanISBN}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('ISBN search failed:', error);
      throw error;
    }
  }

  async searchByTitle(title: string): Promise<BookSearchResult[]> {
    try {
      const encodedTitle = encodeURIComponent(title);
      const response = await fetch(`${GOOGLE_BOOKS_API_BASE}?q=intitle:${encodedTitle}&maxResults=10`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Title search failed:', error);
      throw error;
    }
  }

  transformToBook(searchResult: BookSearchResult) {
    const { volumeInfo } = searchResult;
    const isbn = volumeInfo.industryIdentifiers?.find(
      (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier || '';

    return {
      isbn,
      title: volumeInfo.title || 'Unknown Title',
      authors: volumeInfo.authors || ['Unknown Author'],
      publisher: volumeInfo.publisher || '',
      publishedDate: volumeInfo.publishedDate || '',
      description: volumeInfo.description || '',
      thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
      pageCount: volumeInfo.pageCount || 0,
      categories: volumeInfo.categories || [],
      status: 'unread' as const
    };
  }
}