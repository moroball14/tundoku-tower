import { useState } from 'react';
import { BookApiService } from '../services/bookApi';
import type { BookSearchResult } from '../types/book';

interface BookSearchProps {
  onBookSelect: (book: any) => void;
}

export default function BookSearch({ onBookSelect }: BookSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'isbn' | 'title'>('isbn');

  const bookApi = new BookApiService();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      let results: BookSearchResult[];
      if (searchType === 'isbn') {
        results = await bookApi.searchByISBN(searchQuery);
      } else {
        results = await bookApi.searchByTitle(searchQuery);
      }
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('検索に失敗しました。もう一度お試しください。');
    }
    setIsLoading(false);
  };

  const handleBookSelect = (searchResult: BookSearchResult) => {
    const book = bookApi.transformToBook(searchResult);
    onBookSelect(book);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSearchType('isbn')}
            className={`px-4 py-2 rounded ${
              searchType === 'isbn'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            ISBN検索
          </button>
          <button
            onClick={() => setSearchType('title')}
            className={`px-4 py-2 rounded ${
              searchType === 'title'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            タイトル検索
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchType === 'isbn' 
                ? 'ISBNを入力してください (例: 9784123456789)'
                : '書籍タイトルを入力してください'
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '検索中...' : '検索'}
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">検索結果</h3>
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleBookSelect(result)}
            >
              <div className="flex gap-4">
                {result.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={result.volumeInfo.imageLinks.thumbnail}
                    alt={result.volumeInfo.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{result.volumeInfo.title}</h4>
                  <p className="text-gray-600">
                    {result.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.volumeInfo.publisher} • {result.volumeInfo.publishedDate}
                  </p>
                  {result.volumeInfo.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {result.volumeInfo.description.substring(0, 150)}...
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}