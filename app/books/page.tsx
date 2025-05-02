"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navigation from "@/components/Navigation";
import { BOOK_GENRES } from "@/lib/genres";

interface Book {
  id: number;
  title: string;
  author: string;
  genres: string[];
  status: "WANT_TO_READ" | "READING" | "READ";
  createdAt: string;
}

export default function BooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newBook, setNewBook] = useState<{
    title: string;
    author: string;
    genres: string[];
    status: "WANT_TO_READ" | "READING" | "READ";
  }>({
    title: "",
    author: "",
    genres: [],
    status: "WANT_TO_READ",
  });
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchBooks();
    }
  }, [status, router]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/books");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const addedBook = await response.json();
      setBooks([addedBook, ...books]);
      setNewBook({
        title: "",
        author: "",
        genres: [],
        status: "WANT_TO_READ",
      });
      toast.success("Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book");
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks(books.filter((book) => book.id !== id));
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: Book["status"]) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update book status");
      }

      const updatedBook = await response.json();
      setBooks(
        books.map((book) => (book.id === id ? updatedBook : book))
      );
      toast.success("Book status updated!");
    } catch (error) {
      console.error("Error updating book status:", error);
      toast.error("Failed to update book status");
    }
  };

  const handleGenreToggle = (genre: string) => {
    setNewBook((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesStatus = !filter || book.status === filter;
      const matchesGenre = !selectedGenre || book.genres.includes(selectedGenre);
      const matchesSearch = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesGenre && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "author-asc":
          return a.author.localeCompare(b.author);
        case "author-desc":
          return b.author.localeCompare(a.author);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">My Book Tracker</h1>

          <form onSubmit={handleAddBook} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Book Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="w-full p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white text-left flex justify-between items-center"
                >
                  <span>Select Genres</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isGenreDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {BOOK_GENRES.map((genre) => (
                      <div
                        key={genre}
                        className={`p-2 hover:bg-gray-600 cursor-pointer ${
                          newBook.genres.includes(genre) ? 'bg-blue-600/20' : ''
                        }`}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newBook.genres.includes(genre)}
                            onChange={() => {}}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700"
                          />
                          <span className="text-white">{genre}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {newBook.genres.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newBook.genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-600/30"
                        >
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <select
                value={newBook.status}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    status: e.target.value as Book["status"],
                  })
                }
                className="p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white"
              >
                <option value="WANT_TO_READ">Want to Read</option>
                <option value="READING">Reading</option>
                <option value="READ">Read</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Add Book
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="">All Statuses</option>
                <option value="WANT_TO_READ">Want to Read</option>
                <option value="READING">Reading</option>
                <option value="READ">Read</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="">All Genres</option>
                {BOOK_GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-gray-700 rounded-xl p-6 flex flex-col"
                >
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-white mb-2">{book.title}</h2>
                    <p className="text-gray-300 mb-4">Author: {book.author}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.genres.map((genre) => (
                        <span
                          key={genre}
                          className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <select
                      value={book.status}
                      onChange={(e) =>
                        handleUpdateStatus(book.id, e.target.value as Book["status"])
                      }
                      className="bg-gray-600 text-white rounded-md px-2 py-1 text-sm"
                    >
                      <option value="WANT_TO_READ">Want to Read</option>
                      <option value="READING">Reading</option>
                      <option value="READ">Read</option>
                    </select>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 