CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  isbn TEXT UNIQUE,
  title TEXT NOT NULL,
  authors TEXT NOT NULL, -- JSON array as string
  publisher TEXT,
  published_date TEXT,
  description TEXT,
  thumbnail TEXT,
  page_count INTEGER,
  categories TEXT, -- JSON array as string
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'completed')),
  added_at TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_added_at ON books(added_at);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);