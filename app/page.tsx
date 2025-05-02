"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/movies");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">Media Tracker</h1>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Track Your Movies, Books & Songs,<br />
              <span className="text-blue-400">Your Way</span>
            </h2>
            <p className="text-xl text-gray-300">
              Organize your watchlist, reading list, and playlist. Stay on top of your media habits with ease.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border-2 border-blue-500 text-blue-400 px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">The Shawshank Redemption</h3>
                  <span className="text-sm text-green-400">Watched</span>
                </div>
                <p className="text-gray-400">Drama</p>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 absolute top-8 left-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">1984 by George Orwell</h3>
                  <span className="text-sm text-yellow-400">Reading</span>
                </div>
                <p className="text-gray-400">Dystopian</p>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 absolute top-16 left-16 transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">Someone Like You</h3>
                  <span className="text-sm text-blue-400">Want to Listen</span>
                </div>
                <p className="text-gray-400">Pop</p>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Organize Your Library</h3>
            <p className="text-gray-300">Track your movies, books, and songs across all statuses — want to, currently, or done.</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="text-gray-300">Stay on top of your reading, listening, and watching goals with progress bars and more.</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Insights</h3>
            <p className="text-gray-300">Uncover trends and insights about your media habits across books, music, and films.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
