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

    if (status) {
      query += " WHERE status = '" + status + "'";
    }

    query += " ORDER BY added_at ASC";

    const results: Book[] = [];
    const stmt = this.db.prepare(query);
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        id: row.id as string,
        isbn: row.isbn as string,
        title: row.title as string,
        authors: JSON.parse(row.authors as string),
        publisher: row.publisher as string,
        publishedDate: row.published_date as string,
        description: row.description as string,
        thumbnail: row.thumbnail as string,
        pageCount: row.page_count as number,
        categories: JSON.parse((row.categories as string) || "[]"),
        status: row.status as Book["status"],
        addedAt: row.added_at as string,
        startedAt: row.started_at as string,
        completedAt: row.completed_at as string,
      });
    }
    
    stmt.free();
    return results;
  }

  async updateBookStatus(id: string, status: Book["status"]): Promise<void> {
    const now = new Date().toISOString();
    let query = `UPDATE books SET status = ? WHERE id = ?`;
    let params = [status, id];

    if (status === "reading") {
      query = `UPDATE books SET status = ?, started_at = ? WHERE id = ?`;
      params = [status, now, id];
    } else if (status === "completed") {
      query = `UPDATE books SET status = ?, completed_at = ? WHERE id = ?`;
      params = [status, now, id];
    }

    const stmt = this.db.prepare(query);
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
