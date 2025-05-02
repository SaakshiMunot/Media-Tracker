"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Media Tracker
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/movies"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/movies"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Movies
                </Link>
                <Link
                  href="/books"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/books"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Books
                </Link>
                <Link
                  href="/songs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/songs"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Songs
                </Link>
                <Link
                  href="/stats"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/stats"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Stats
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 