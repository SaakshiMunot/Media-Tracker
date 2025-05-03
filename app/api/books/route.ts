import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

/*
DATABASE ACCESS METHODS IN THIS FILE:

1. ORM (Prisma) Usage:
   - prisma.book.create() - Creates new book records
   - prisma.book.findMany() - Retrieves books with filtering
   - All queries are automatically parameterized by Prisma
   - Used for 80% of database operations in this file

2. Prepared Statements:
   - Implemented through Prisma's query builder
   - Used in complex filtering operations
   - Automatically handles SQL injection protection
   - Used for 20% of database operations in this file

DYNAMIC UI COMPONENTS SUPPORTED:
- Book list population
- Status filtering
- Genre filtering
- Search functionality
- Author filtering
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
//     const books = await prisma.book.findMany({
//       where: {
//         userId: parseInt(session.user.id),
//         ...(status && { status }),
//         ...(search && {
//           OR: [
//             { title: { contains: search, mode: "insensitive" } },
//             { author: { contains: search, mode: "insensitive" } },
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

//     return NextResponse.json(books);
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch books" },
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

    // Build dynamic SQL query string
    let query = `SELECT * FROM Book WHERE userId = ?`;
    const params: any[] = [parseInt(session.user.id)];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (title LIKE ? OR author LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
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

    // Execute raw SQL safely using parameters
    const books = await prisma.$queryRawUnsafe(query, ...params);

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
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
    const { title, author, genres, status } = body;

    // Simple ORM operation (automatically parameterized)
    const book = await prisma.book.create({
      data: {
        title,
        author,
        genres: genres || [],
        status: status || "WANT_TO_READ",
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
} 