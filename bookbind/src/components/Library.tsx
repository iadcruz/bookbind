"use client";

import { useState, useEffect, useTransition } from "react";
import { browseBooks, searchBooks } from "@/actions/book.action";
import { Library } from 'lucide-react';
import { Button } from "./ui/button";
import { addToReadLater } from "@/actions/user.action";
import { toast } from "sonner";

type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
  };
};

export default function Browse() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const items = await browseBooks("fiction");
      setBooks(items);
      setLoading(false);
    })();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const items = await searchBooks(query);
    setBooks(items);
    setLoading(false);
  };

  const handleAddLater = (book: Book) => {
    startTransition(async () => {
      await addToReadLater({
        googleId: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0],
      });
      toast("Added to Reading List!");
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"><Library className="inline size-10 pr-2 pb-2"/>Book Library</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, author, or title..."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <Button
          type="submit"
        >
          Search
        </Button>
      </form>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h2 className="font-semibold">{book.volumeInfo.title}</h2>
              <p className="text-sm text-gray-600">
                {book.volumeInfo.authors?.join(", ")}
              </p>
              <Button
                onClick={() => handleAddLater(book)}
                disabled={isPending}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded-xl w-full"
              >
                {isPending ? "Adding..." : "➕ Read Later"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
