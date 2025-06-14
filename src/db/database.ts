import type { Book } from "../types/book";

declare global {
  interface Window {
    initSqlJs: () => Promise<any>;
  }
}

export class DatabaseManager {
  private db: any = null;
  private SQL: any = null;

  async initialize(): Promise<void> {
    try {
      // SQLite WebAssembly の初期化
      this.SQL = await window.initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
      });

      // 既存のデータベースがあるかチェック
      const existingData = localStorage.getItem("tundoku-db");
      if (existingData) {
        const uint8Array = new Uint8Array(JSON.parse(existingData));
        this.db = new this.SQL.Database(uint8Array);
      } else {
        this.db = new this.SQL.Database();
        await this.createTables();
      }
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        isbn TEXT UNIQUE,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        publisher TEXT,
        published_date TEXT,
        description TEXT,
        thumbnail TEXT,
        page_count INTEGER,
        categories TEXT,
        status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'completed')),
        added_at TEXT NOT NULL,
        started_at TEXT,
        completed_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
      CREATE INDEX IF NOT EXISTS idx_books_added_at ON books(added_at);
      CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
    `;

    this.db.exec(schema);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    const data = this.db.export();
    localStorage.setItem("tundoku-db", JSON.stringify(Array.from(data)));
  }

  async addBook(book: Omit<Book, "id" | "addedAt">): Promise<Book> {
    const id = crypto.randomUUID();
    const addedAt = new Date().toISOString();

    const newBook: Book = {
      id,
      addedAt,
      ...book,
    };

    const stmt = this.db.prepare(`
      INSERT INTO books (
        id, isbn, title, authors, publisher, published_date, 
        description, thumbnail, page_count, categories, status, added_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      newBook.id,
      newBook.isbn,
      newBook.title,
      JSON.stringify(newBook.authors),
      newBook.publisher,
      newBook.publishedDate,
      newBook.description,
      newBook.thumbnail,
      newBook.pageCount,
      JSON.stringify(newBook.categories),
      newBook.status,
      newBook.addedAt,
    ]);

    stmt.free();
    this.saveToLocalStorage();

    return newBook;
  }

  async getBooks(status?: string): Promise<Book[]> {
    let query = "SELECT * FROM books";
    const params: any[] = [];

    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY added_at DESC";

    const stmt = this.db.prepare(query);
    const result = stmt.all(params);
    stmt.free();

    return result.map((row: any) => ({
      id: row.id,
      isbn: row.isbn,
      title: row.title,
      authors: JSON.parse(row.authors),
      publisher: row.publisher,
      publishedDate: row.published_date,
      description: row.description,
      thumbnail: row.thumbnail,
      pageCount: row.page_count,
      categories: JSON.parse(row.categories || "[]"),
      status: row.status,
      addedAt: row.added_at,
      startedAt: row.started_at,
      completedAt: row.completed_at,
    }));
  }

  async updateBookStatus(id: string, status: Book["status"]): Promise<void> {
    const now = new Date().toISOString();
    let updateField = "";

    if (status === "reading") {
      updateField = ", started_at = ?";
    } else if (status === "completed") {
      updateField = ", completed_at = ?";
    }

    const stmt = this.db.prepare(`
      UPDATE books SET status = ?${updateField} WHERE id = ?
    `);

    const params = [status];
    if (updateField) {
      params.push(now);
    }
    params.push(id);

    stmt.run(params);
    stmt.free();
    this.saveToLocalStorage();
  }

  async deleteBook(id: string): Promise<void> {
    const stmt = this.db.prepare("DELETE FROM books WHERE id = ?");
    stmt.run([id]);
    stmt.free();
    this.saveToLocalStorage();
  }
}
