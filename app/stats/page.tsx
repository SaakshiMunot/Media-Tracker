"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Navigation from "@/components/Navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Stats {
  totalMovies: number;
  moviesByStatus: {
    WANT_TO_WATCH: number;
    WATCHING: number;
    WATCHED: number;
  };
  moviesByGenre: Record<string, number>;
  totalBooks: number;
  booksByStatus: {
    WANT_TO_READ: number;
    READING: number;
    READ: number;
  };
  booksByGenre: Record<string, number>;
  totalSongs: number;
  songsByStatus: {
    WANT_TO_LISTEN: number;
    LISTENING: number;
    LISTENED: number;
  };
  songsByGenre: Record<string, number>;
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusData = {
    labels: ["Want to Watch", "Watching", "Watched"],
    datasets: [
      {
        label: "Movies by Status",
        data: stats ? [
          stats.moviesByStatus.WANT_TO_WATCH,
          stats.moviesByStatus.WATCHING,
          stats.moviesByStatus.WATCHED,
        ] : [0, 0, 0],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const genreData = {
    labels: stats ? Object.keys(stats.moviesByGenre) : [],
    datasets: [
      {
        label: "Movies by Genre",
        data: stats ? Object.values(stats.moviesByGenre) : [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const bookStatusData = {
    labels: ["Want to Read", "Reading", "Read"],
    datasets: [
      {
        label: "Books by Status",
        data: stats ? [
          stats.booksByStatus.WANT_TO_READ,
          stats.booksByStatus.READING,
          stats.booksByStatus.READ,
        ] : [0, 0, 0],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const bookGenreData = {
    labels: stats ? Object.keys(stats.booksByGenre) : [],
    datasets: [
      {
        label: "Books by Genre",
        data: stats ? Object.values(stats.booksByGenre) : [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const songStatusData = {
    labels: ["Want to Listen", "Listening", "Listened"],
    datasets: [
      {
        label: "Songs by Status",
        data: stats ? [
          stats.songsByStatus.WANT_TO_LISTEN,
          stats.songsByStatus.LISTENING,
          stats.songsByStatus.LISTENED,
        ] : [0, 0, 0],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const songGenreData = {
    labels: stats ? Object.keys(stats.songsByGenre) : [],
    datasets: [
      {
        label: "Songs by Genre",
        data: stats ? Object.values(stats.songsByGenre) : [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Movie Statistics */}
        <div className="bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Movie Statistics</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Total Movies</h2>
              <p className="text-3xl font-bold text-blue-400">{stats?.totalMovies || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Currently Watching</h2>
              <p className="text-3xl font-bold text-green-400">{stats?.moviesByStatus.WATCHING || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Movies Watched</h2>
              <p className="text-3xl font-bold text-purple-400">{stats?.moviesByStatus.WATCHED || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Wanting to Watch</h2>
              <p className="text-3xl font-bold text-purple-400">{stats?.moviesByStatus.WANT_TO_WATCH || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Movies by Status</h2>
            <div className="h-80">
              <Bar data={statusData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Movies by Genre</h2>
            <div className="h-80">
              <Bar data={genreData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Book Statistics */}
        <div className="bg-gray-800 rounded-2xl shadow-sm p-8 mt-8">

          <h1 className="text-4xl font-bold text-white mb-6">Book Statistics</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Total Books</h2>
              <p className="text-3xl font-bold text-blue-400">{stats?.totalBooks || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Currently Reading</h2>
              <p className="text-3xl font-bold text-green-400">{stats?.booksByStatus.READING || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Books Read</h2>
              <p className="text-3xl font-bold text-purple-400">{stats?.booksByStatus.READ || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Want to Read</h2>
              <p className="text-3xl font-bold text-purple-400">{stats?.booksByStatus.WANT_TO_READ || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Books by Status</h2>
            <div className="h-80">
              <Bar data={bookStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Books by Genre</h2>
            <div className="h-80">
              <Bar data={bookGenreData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Song Statistics */}
        <div className="bg-gray-800 rounded-2xl shadow-sm p-8 mt-8">
          <h1 className="text-4xl font-bold text-white mb-6">Music Statistics</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Total Songs</h2>
              <p className="text-3xl font-bold text-blue-400">{stats?.totalSongs || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Currently Listening</h2>
              <p className="text-3xl font-bold text-green-400">{stats?.songsByStatus.LISTENING || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Songs Listened</h2>
              <p className="text-3xl font-bold text-purple-400">{stats?.songsByStatus.LISTENED || 0}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Want to Listen</h2>
              <p className="text-3xl font-bold text-purple-400">{stats?.songsByStatus.WANT_TO_LISTEN || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Songs by Status</h2>
            <div className="h-80">
              <Bar data={songStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Songs by Genre</h2>
            <div className="h-80">
              <Bar data={songGenreData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 