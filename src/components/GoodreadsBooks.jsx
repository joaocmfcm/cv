import React, { useState, useEffect } from 'react';

const GOODREADS_ID = '19235489-jo-o-martins';
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

const GoodreadsBooks = () => {
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const currentlyReadingUrl = encodeURIComponent(`https://www.goodreads.com/review/list_rss/${GOODREADS_ID}?shelf=currently-reading`);
        const readUrl = encodeURIComponent(`https://www.goodreads.com/review/list_rss/${GOODREADS_ID}?shelf=read`);

        const [currentlyReadingRes, readRes] = await Promise.all([
          fetch(`${RSS2JSON_API}${currentlyReadingUrl}`),
          fetch(`${RSS2JSON_API}${readUrl}`)
        ]);

        const currentlyReadingData = await currentlyReadingRes.json();
        const readData = await readRes.json();

        setCurrentlyReading(currentlyReadingData.items ? currentlyReadingData.items.map(parseGoodreadsItem).slice(0, 5) : []);

        // Show only the latest 10 read books to keep the UI clean
        let readItems = readData.items ? readData.items.map(parseGoodreadsItem) : [];
        setReadBooks(readItems.slice(0, 10));

      } catch (error) {
        console.error("Error fetching Goodreads data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getHighResImageUrl = (url) => {
    // Goodreads thumbnails have a string like _SY75_ or _SX50_ before the extension.
    // Removing this generally returns the original larger image.
    return url.replace(/\._S[Y|X]\d+_/g, '');
  };

  const parseGoodreadsItem = (item) => {
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    const authorMatch = item.description.match(/author:\s*(.+?)<br>/);

    // Clean up title (sometimes it includes the author name after a hyphen in the RSS)
    let cleanTitle = item.title.split(' - ')[0].trim();
    // Unescape common HTML entities
    cleanTitle = cleanTitle.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    return {
      id: item.guid,
      title: cleanTitle,
      author: authorMatch ? authorMatch[1].trim() : 'Unknown Author',
      link: item.link,
      cover: imgMatch ? getHighResImageUrl(imgMatch[1]) : '',
    };
  };

  const BookCard = ({ book }) => (
    <a
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

  if (loading) {
    return (
      <div className="w-full mt-16 animate-pulse">
        <div className="h-8 bg-surface w-48 rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl aspect-[2/3] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (currentlyReading.length === 0 && readBooks.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 mt-16 mb-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold tracking-tight text-primary flex items-center gap-3">
          Library
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Books I'm currently reading and my recent completions.</p>
      </div>

      {currentlyReading.length > 0 && (
        <div className="mb-12">
          <h4 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Currently Reading
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {readBooks.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-secondary mb-6">Recently Read</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {readBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodreadsBooks;
