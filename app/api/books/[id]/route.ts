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
    const { title, author, genres, status } = body;

    const book = await prisma.book.update({
      where: {
        id: parseInt(params.id),
        userId: parseInt(session.user.id),
      },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(genres && { genres }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
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

    // await prisma.book.delete({
    //   where: {
    //     id: parseInt(params.id),
    //     userId: parseInt(session.user.id),
    //   },
    // });

    const bookId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    const result = await prisma.$executeRawUnsafe(
      `DELETE FROM Book WHERE id = ? AND userId = ?`,
      bookId,
      userId
    );

    if (result === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
} 