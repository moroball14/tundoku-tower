import { useState, useEffect } from 'react';
import { DatabaseManager } from './db/database';
import type { Book } from './types/book';
import BookSearch from './components/BookSearch';
import BookTower from './components/BookTower';
import BookModal from './components/BookModal';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dbManager] = useState(() => new DatabaseManager());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await dbManager.initialize();
      await loadBooks();
    } catch (error) {
      console.error('App initialization failed:', error);
      alert('アプリの初期化に失敗しました。ページを再読み込みしてください。');
    }
    setIsLoading(false);
  };

  const loadBooks = async () => {
    try {
      const allBooks = await dbManager.getBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  };

  const handleBookAdd = async (bookData: any) => {
    try {
      const newBook = await dbManager.addBook(bookData);
      setBooks(prev => [...prev, newBook]);
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('書籍の追加に失敗しました。');
    }
  };

  const handleStatusUpdate = async (bookId: string, status: Book['status']) => {
    try {
      await dbManager.updateBookStatus(bookId, status);
      await loadBooks();
    } catch (error) {
      console.error('Failed to update book status:', error);
      alert('ステータスの更新に失敗しました。');
    }
  };

  const handleBookDelete = async (bookId: string) => {
    try {
      await dbManager.deleteBook(bookId);
      await loadBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert('書籍の削除に失敗しました。');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-lg">積読タワーを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 積読タワー
          </h1>
          <p className="text-gray-600">
            本を積んで、読んで、楽しもう！
          </p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              📖 本を検索・追加
            </h2>
            <BookSearch onBookSelect={handleBookAdd} />
          </section>

          <section className="bg-white rounded-lg shadow-md">
            <BookTower 
              books={books}
              onBookClick={setSelectedBook}
            />
          </section>
        </div>

        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdateStatus={handleStatusUpdate}
          onDelete={handleBookDelete}
        />
      </div>
    </div>
  );
}

export default App
