import type { Book } from '../types/book';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onUpdateStatus: (bookId: string, status: Book['status']) => void;
  onDelete: (bookId: string) => void;
}

export default function BookModal({ book, onClose, onUpdateStatus, onDelete }: BookModalProps) {
  if (!book) return null;

  const handleStatusChange = (status: Book['status']) => {
    onUpdateStatus(book.id, status);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('この本を削除しますか？')) {
      onDelete(book.id);
      onClose();
    }
  };

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'reading': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
    }
  };

  const getStatusText = (status: Book['status']) => {
    switch (status) {
      case 'unread': return '未読';
      case 'reading': return '読書中';
      case 'completed': return '読了';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold pr-4">{book.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex gap-6 mb-6">
            {book.thumbnail && (
              <div className="flex-shrink-0">
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">著者: </span>
                  <span>{book.authors.join(', ')}</span>
                </div>
                
                {book.publisher && (
                  <div>
                    <span className="font-semibold">出版社: </span>
                    <span>{book.publisher}</span>
                  </div>
                )}
                
                {book.publishedDate && (
                  <div>
                    <span className="font-semibold">出版日: </span>
                    <span>{book.publishedDate}</span>
                  </div>
                )}
                
                {book.pageCount > 0 && (
                  <div>
                    <span className="font-semibold">ページ数: </span>
                    <span>{book.pageCount}ページ</span>
                  </div>
                )}
                
                {book.isbn && (
                  <div>
                    <span className="font-semibold">ISBN: </span>
                    <span>{book.isbn}</span>
                  </div>
                )}
                
                <div>
                  <span className="font-semibold">ステータス: </span>
                  <span className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(book.status)}`}>
                    {getStatusText(book.status)}
                  </span>
                </div>
                
                <div>
                  <span className="font-semibold">追加日: </span>
                  <span>{new Date(book.addedAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
            </div>
          </div>

          {book.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">説明</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {book.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">カテゴリ</h3>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <h3 className="w-full font-semibold mb-2">ステータスを変更</h3>
            
            <button
              onClick={() => handleStatusChange('unread')}
              disabled={book.status === 'unread'}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              未読にする
            </button>
            
            <button
              onClick={() => handleStatusChange('reading')}
              disabled={book.status === 'reading'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              読書中にする
            </button>
            
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={book.status === 'completed'}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              読了にする
            </button>
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-auto"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}