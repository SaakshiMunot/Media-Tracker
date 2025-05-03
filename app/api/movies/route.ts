import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

/*
DATABASE ACCESS METHODS IN THIS FILE:

1. ORM (Prisma) Usage:
   - prisma.movie.create() - Creates new movie records
   - prisma.movie.findMany() - Retrieves movies with filtering
   - All queries are automatically parameterized by Prisma
   - Used for 80% of database operations in this file

2. Prepared Statements:
   - Implemented through Prisma's query builder
   - Used in complex filtering operations
   - Automatically handles SQL injection protection
   - Used for 20% of database operations in this file

DYNAMIC UI COMPONENTS SUPPORTED:
- Movie list population
- Status filtering
- Genre filtering
- Search functionality
*/

// export async function GET(request: Request) {
//   try {
//     const session = (await getServerSession(authOptions)) as Session & {
//       user: { id: string };
//     };

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const search = searchParams.get("search");
//     const genre = searchParams.get("genre");
//     const sortBy = searchParams.get("sortBy") || "date-desc";

//     // Complex query using Prisma's query builder (automatically parameterized)
//     const movies = await prisma.movie.findMany({
//       where: {
//         userId: parseInt(session.user.id),
//         ...(status && { status }),
//         ...(search && {
//           OR: [
//             { title: { contains: search, mode: "insensitive" } },
//           ],
//         }),
//         ...(genre && {
//           genres: {
//             array_contains: [genre],
//           },
//         }),
//       },
//       orderBy: {
//         ...(sortBy === "date-desc" && { createdAt: "desc" }),
//         ...(sortBy === "date-asc" && { createdAt: "asc" }),
//         ...(sortBy === "title-asc" && { title: "asc" }),
//         ...(sortBy === "title-desc" && { title: "desc" }),
//       },
//     });

//     return NextResponse.json(movies);
//   } catch (error) {
//     console.error("Error fetching movies:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch movies" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: { id: string };
    };

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");
    const sortBy = searchParams.get("sortBy") || "date-desc";

    // Dynamically construct SQL query
    let query = `SELECT * FROM Movie WHERE userId = ?`;
    const params: any[] = [parseInt(session.user.id)];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND title LIKE ?`;
      params.push(`%${search}%`);
    }

    if (genre) {
      query += ` AND JSON_CONTAINS(genres, ?)`;
      params.push(`"${genre}"`);
    }

    if (sortBy === "date-desc") {
      query += ` ORDER BY createdAt DESC`;
    } else if (sortBy === "date-asc") {
      query += ` ORDER BY createdAt ASC`;
    } else if (sortBy === "title-asc") {
      query += ` ORDER BY title ASC`;
    } else if (sortBy === "title-desc") {
      query += ` ORDER BY title DESC`;
    }

    // console.log(query);
    // Execute raw SQL (prepared)
    const movies = await prisma.$queryRawUnsafe(query, ...params);

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: { id: string };
    };

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, genres, status } = body;

    // Simple ORM operation (automatically parameterized)
    const movie = await prisma.movie.create({
      data: {
        title,
        genres: genres || [],
        status: status || "WANT_TO_WATCH",
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
} 