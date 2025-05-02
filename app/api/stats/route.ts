// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "../auth/[...nextauth]/route";

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = parseInt(session.user.id);

//     const [totalMovies, moviesByStatus, moviesByGenre] = await Promise.all([
//       prisma.movie.count({
//         where: { userId },
//       }),
//       prisma.movie.groupBy({
//         by: ["status"],
//         where: { userId },
//         _count: true,
//       }),
//       prisma.movie.groupBy({
//         by: ["genre"],
//         where: { userId },
//         _count: true,
//       }),
//     ]);

//     return NextResponse.json({
//       totalMovies,
//       moviesByStatus: moviesByStatus.map((item) => ({
//         status: item.status,
//         count: item._count,
//       })),
//       moviesByGenre: moviesByGenre.map((item) => ({
//         genre: item.genre || "Unknown",
//         count: item._count,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// } 

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Movie {
  id: number;
  title: string;
  genres: string[];
  status: "WANT_TO_WATCH" | "WATCHING" | "WATCHED";
  userId: number;
}

interface Book {
  id: number;
  title: string;
  genres: string[];
  status: "WANT_TO_READ" | "READING" | "READ";
  userId: number;
}

interface Song {
  id: number;
  title: string;
  genres: string[];
  status: "WANT_TO_LISTEN" | "LISTENING" | "LISTENED";
  userId: number;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | null;
    
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [movies, books, songs] = await Promise.all([
      prisma.movie.findMany({
        where: {
          userId: parseInt(user.id),
        },
      }) as Promise<Movie[]>,
      prisma.book.findMany({
        where: {
          userId: parseInt(user.id),
        },
      }) as Promise<Book[]>,
      prisma.song.findMany({
        where: {
          userId: parseInt(user.id),
        },
      }) as Promise<Song[]>,
    ]);

    // Calculate movie statistics
    const totalMovies = movies.length;
    const moviesByStatus = {
      WANT_TO_WATCH: movies.filter((movie) => movie.status === "WANT_TO_WATCH").length,
      WATCHING: movies.filter((movie) => movie.status === "WATCHING").length,
      WATCHED: movies.filter((movie) => movie.status === "WATCHED").length,
    };
    const moviesByGenre: Record<string, number> = {};
    movies.forEach((movie) => {
      const genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres) : movie.genres;
      genres.forEach((genre: string) => {
        moviesByGenre[genre] = (moviesByGenre[genre] || 0) + 1;
      });
    });

    // Calculate book statistics
    const totalBooks = books.length;
    const booksByStatus = {
      WANT_TO_READ: books.filter((book) => book.status === "WANT_TO_READ").length,
      READING: books.filter((book) => book.status === "READING").length,
      READ: books.filter((book) => book.status === "READ").length,
    };
    const booksByGenre: Record<string, number> = {};
    books.forEach((book) => {
      const genres = typeof book.genres === 'string' ? JSON.parse(book.genres) : book.genres;
      genres.forEach((genre: string) => {
        booksByGenre[genre] = (booksByGenre[genre] || 0) + 1;
      });
    });

    // Calculate song statistics
    const totalSongs = songs.length;
    const songsByStatus = {
      WANT_TO_LISTEN: songs.filter((song) => song.status === "WANT_TO_LISTEN").length,
      LISTENING: songs.filter((song) => song.status === "LISTENING").length,
      LISTENED: songs.filter((song) => song.status === "LISTENED").length,
    };
    const songsByGenre: Record<string, number> = {};
    songs.forEach((song) => {
      const genres = typeof song.genres === 'string' ? JSON.parse(song.genres) : song.genres;
      genres.forEach((genre: string) => {
        songsByGenre[genre] = (songsByGenre[genre] || 0) + 1;
      });
    });

    return NextResponse.json({
      totalMovies,
      moviesByStatus,
      moviesByGenre,
      totalBooks,
      booksByStatus,
      booksByGenre,
      totalSongs,
      songsByStatus,
      songsByGenre,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}