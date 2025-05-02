"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navigation from "@/components/Navigation";

interface Movie {
  id: number;
  title: string;
  genres: string[];
  status: "WANT_TO_WATCH" | "WATCHING" | "WATCHED";
  createdAt: string;
}

const GENRES = [
  // Main Genres
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Musical",
  "Mystery",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
  "Disney",
  "Pixar",
  "Marvel",
  "DC",
  "Anime",
  "Cartoon",
  "Historical Thriller",
  "Historical Drama",
  "Historical Action",
  "Historical Comedy",
  "Historical Horror",
  "Historical Mystery",
  "Historical War",
  "Historical Western",
  "Historical Animation",
  // Action Subgenres
  "Martial Arts",
  "Superhero",
  "Disaster",
  "Spy/Espionage",
  // Comedy Subgenres
  "Romantic Comedy",
  "Slapstick",
  "Satire/Parody",
  "Dark Comedy",
  "Teen Comedy",
  "Dramedy",
  // Crime Subgenres
  "Detective",
  "Gangster/Mafia",
  "Heist",
  "Police Procedural",
  "Legal Drama",
  // Horror Subgenres
  "Supernatural",
  "Slasher",
  "Psychological Horror",
  "Found Footage",
  "Monster/Creature Feature",
  "Gothic Horror",
  "Zombie",
  // Sci-Fi Subgenres
  "Space Opera",
  "Time Travel",
  "Cyberpunk",
  "Alien Invasion",
  "Post-Apocalyptic",
  "Dystopian",
  // Romance Subgenres
  "Historical Romance",
  "Fantasy Romance",
  "Coming-of-Age Romance",
  "Romantic Drama",
  // Fantasy Subgenres
  "High Fantasy",
  "Urban Fantasy",
  "Sword and Sorcery",
  "Fairy Tale",
  "Mythological",
  // Mystery & Thriller Subgenres
  "Psychological Thriller",
  "Crime Thriller",
  "Noir",
  "Legal Thriller",
  "Political Thriller",
  "Techno-Thriller",
  // Historical Subgenres
  "Biographical",
  "Period Drama",
  "Historical Epic",
  // Musical Subgenres
  "Jukebox Musical",
  "Dance Musical",
  "Stage-to-Screen",
  // Other Categories
  "Documentary",
  "Mockumentary",
  "Experimental",
  "Family",
  "Coming-of-Age",
  "Sport",
  "Road Movie",
  "Silent Film",
  "Anthology",
  // International
  "French",
  "Spanish",
  "Italian",
  "German",
  "Japanese",
  "Korean",
  "Chinese",
  "Bollywood",
  "Hollywood",
  "Tollywood",
  "Kollywood",
  "Lollywood",  
];

export default function MoviesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newMovie, setNewMovie] = useState<{
    title: string;
    genres: string[];
    status: Movie["status"];
  }>({
    title: "",
    genres: [],
    status: "WANT_TO_WATCH",
  });
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchMovies();
    }
  }, [status, router]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`/api/movies${filter ? `?status=${filter}` : ""}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      toast.error("Failed to fetch movies");
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        setNewMovie({ title: "", genres: [], status: "WANT_TO_WATCH" });
        fetchMovies();
        toast.success("Movie added successfully!");
      } else {
        toast.error("Failed to add movie");
      }
    } catch (error) {
      toast.error("Failed to add movie");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: Movie["status"]) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchMovies();
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteMovie = async (id: number) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMovies();
        toast.success("Movie deleted successfully");
      } else {
        toast.error("Failed to delete movie");
      }
    } catch (error) {
      toast.error("Failed to delete movie");
    }
  };

  const toggleGenre = (genre: string) => {
    setNewMovie(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const filteredAndSortedMovies = movies
    .filter(movie => {
      const matchesStatus = !filter || movie.status === filter;
      const matchesGenre = !selectedGenre || movie.genres.includes(selectedGenre);
      const matchesSearch = !searchQuery || 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase());
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
        default:
          return 0;
      }
    });

  if (status === "loading") {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">My Movie Tracker</h1>

          <form onSubmit={handleAddMovie} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Movie Title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
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
                    {GENRES.map((genre) => (
                      <div
                        key={genre}
                        className={`p-2 hover:bg-gray-600 cursor-pointer ${
                          newMovie.genres.includes(genre) ? 'bg-blue-600/20' : ''
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newMovie.genres.includes(genre)}
                            onChange={() => {}}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700"
                          />
                          <span className="text-white">{genre}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {newMovie.genres.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newMovie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => toggleGenre(genre)}
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
                value={newMovie.status}
                onChange={(e) =>
                  setNewMovie({
                    ...newMovie,
                    status: e.target.value as "WANT_TO_WATCH" | "WATCHING" | "WATCHED",
                  })
                }
                className="p-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white"
              >
                <option value="WANT_TO_WATCH">Want to Watch</option>
                <option value="WATCHING">Watching</option>
                <option value="WATCHED">Watched</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Add Movie
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
                <option value="WANT_TO_WATCH">Want to Watch</option>
                <option value="WATCHING">Watching</option>
                <option value="WATCHED">Watched</option>
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
                {GENRES.map((genre) => (
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-700 rounded-xl p-6 flex flex-col"
              >
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
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
                    value={movie.status}
                    onChange={(e) =>
                      handleUpdateStatus(movie.id, e.target.value as Movie["status"])
                    }
                    className="bg-gray-600 text-white rounded-md px-2 py-1 text-sm"
                  >
                    <option value="WANT_TO_WATCH">Want to Watch</option>
                    <option value="WATCHING">Watching</option>
                    <option value="WATCHED">Watched</option>
                  </select>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
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
        </div>
      </div>
    </div>
  );
} 