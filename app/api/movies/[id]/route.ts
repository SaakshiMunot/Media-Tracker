import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, genres, status } = body;

    const movie = await prisma.movie.update({
      where: {
        id: parseInt(params.id),
        userId: parseInt(session.user.id),
      },
      data: {
        ...(title && { title }),
        ...(genres && { genres }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // await prisma.movie.delete({
    //   where: {
    //     id: parseInt(params.id),
    //     userId: parseInt(session.user.id),
    //   },
    // });
    const result = await prisma.$executeRaw`
      DELETE FROM Movie
      WHERE id = ${parseInt(params.id)} AND userId = ${parseInt(session.user.id)}
    `;

      // result will be the number of affected rows
      if (result === 0) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
      }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
} 