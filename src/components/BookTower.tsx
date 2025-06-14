import { useState, useEffect } from 'react';
import type { Book } from '../types/book';

interface BookTowerProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export default function BookTower({ books, onBookClick }: BookTowerProps) {
  const [animatingBooks, setAnimatingBooks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (books.length > 0) {
      const latestBook = books[0];
      setAnimatingBooks(prev => new Set(prev).add(latestBook.id));
      
      const timer = setTimeout(() => {
        setAnimatingBooks(prev => {
          const newSet = new Set(prev);
          newSet.delete(latestBook.id);
          return newSet;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [books.length]);

  const getBookHeight = (book: Book) => {
    const baseHeight = 40;
    const pageMultiplier = Math.min(book.pageCount / 300, 2);
    return Math.max(baseHeight, baseHeight * pageMultiplier);
  };

  const getBookColor = (book: Book) => {
    const colors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
      'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400'
    ];
    const index = book.title.length % colors.length;
    return colors[index];
  };

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-lg">まだ本が積まれていません</p>
        <p className="text-sm">上の検索フォームから本を追加してみましょう！</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-96 p-8">
      <div className="relative">
        <h2 className="text-2xl font-bold mb-6 text-center">
          📚 積読タワー ({books.length}冊)
        </h2>
        
        <div className="relative flex flex-col-reverse items-center">
          {books.map((book, index) => {
            const height = getBookHeight(book);
            const isAnimating = animatingBooks.has(book.id);
            
            return (
              <div
                key={book.id}
                className={`
                  relative w-32 rounded-sm shadow-md cursor-pointer
                  transition-all duration-1000 ease-out
                  hover:scale-105 hover:shadow-lg
                  ${getBookColor(book)}
                  ${isAnimating ? 'animate-bounce' : ''}
                `}
                style={{ 
                  height: `${height}px`,
                  zIndex: books.length - index,
                  transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)'
                }}
                onClick={() => onBookClick(book)}
                title={`${book.title} - ${book.authors.join(', ')}`}
              >
                <div className="absolute inset-0 p-2 flex flex-col justify-between text-white text-xs">
                  <div className="font-bold leading-tight line-clamp-2">
                    {book.title}
                  </div>
                  <div className="text-xs opacity-80 truncate">
                    {book.authors[0]}
                  </div>
                </div>
                
                {book.thumbnail && (
                  <div className="absolute -right-8 top-0 w-6 h-8 rounded-sm overflow-hidden shadow-sm">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="w-40 h-4 bg-amber-800 rounded-lg mt-2 mx-auto shadow-lg"></div>
        <div className="w-44 h-2 bg-amber-900 rounded-lg mt-1 mx-auto"></div>
      </div>

      <div className="mt-8 text-center">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-red-100 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {books.filter(b => b.status === 'unread').length}
            </div>
            <div className="text-red-700">未読</div>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {books.filter(b => b.status === 'reading').length}
            </div>
            <div className="text-blue-700">読書中</div>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {books.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-green-700">読了</div>
          </div>
        </div>
      </div>
    </div>
  );
}