import { useState, useEffect } from 'react';

const GOODREADS_ID = '19235489-jo-o-martins';
const GOODREADS_PROFILE = `https://www.goodreads.com/user/show/${GOODREADS_ID}`;
const isBookList = (books) => Array.isArray(books) && books.every(book =>
  book && ['id', 'title', 'author', 'link'].every(field => typeof book[field] === 'string' && book[field].trim())
  && typeof book.cover === 'string'
);

const GoodreadsBooks = () => {
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let active = true;

    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}goodreads-data.json`, { signal: controller.signal });
        if (!response.ok) throw new Error('Library data is unavailable');
        const data = await response.json();
        if (!isBookList(data.currentlyReading) || !isBookList(data.readBooks)) {
          throw new Error('Invalid library data');
        }
        if (!active) return;
        setCurrentlyReading(data.currentlyReading);
        setReadBooks(data.readBooks);
      } catch {
        if (active) setUnavailable(true);
      } finally {
        clearTimeout(timeout);
        if (active) setLoading(false);
      }
    };

    fetchBooks();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const renderBookCard = (book) => (
    <a
      key={book.id}
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-surface border border-border/40 rounded-2xl p-4 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-full aspect-[2/3] mb-4 bg-background/50 rounded-xl overflow-hidden">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <span className="text-secondary/50 font-medium text-sm">No Cover</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <h4 className="font-semibold text-primary line-clamp-2 leading-tight mb-1 group-hover:text-blue-500 transition-colors">
          {book.title}
        </h4>
        <p className="text-sm text-secondary line-clamp-1 mt-auto">
          {book.author}
        </p>
      </div>
    </a>
  );

  return (
    <div className="w-full flex flex-col gap-6 mt-16 mb-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold tracking-tight text-primary flex items-center gap-3">
          Library
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Books I&apos;m currently reading and my recent completions.</p>
        <a href={GOODREADS_PROFILE} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:text-blue-500 transition-colors underline underline-offset-4">
          View my Goodreads profile
        </a>
      </div>

      {loading && (
        <div role="status" aria-label="Loading books" className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-surface rounded-2xl aspect-[2/3] w-full" />
          ))}
        </div>
      )}

      {!loading && unavailable && (
        <p role="status" className="text-secondary">Book updates are temporarily unavailable. You can still browse my library on Goodreads.</p>
      )}

      {!loading && !unavailable && currentlyReading.length === 0 && readBooks.length === 0 && (
        <p className="text-secondary">No books to show yet.</p>
      )}

      {currentlyReading.length > 0 && (
        <div className="mb-12">
          <h4 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
            Currently Reading
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentlyReading.map(renderBookCard)}
          </div>
        </div>
      )}

      {readBooks.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-secondary mb-6">Recently Read</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {readBooks.map(renderBookCard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodreadsBooks;
