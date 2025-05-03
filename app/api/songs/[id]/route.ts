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
    const { title, artist, album, genres, status } = body;

    const song = await prisma.song.update({
      where: {
        id: parseInt(params.id),
        userId: parseInt(session.user.id),
      },
      data: {
        ...(title && { title }),
        ...(artist && { artist }),
        ...(album && { album }),
        ...(genres && { genres }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error updating song:", error);
    return NextResponse.json(
      { error: "Failed to update song" },
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

    // await prisma.song.delete({
    //   where: {
    //     id: parseInt(params.id),
    //     userId: parseInt(session.user.id),
    //   },
    // });


    const songId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    const result = await prisma.$executeRawUnsafe(
      `DELETE FROM Song WHERE id = ? AND userId = ?`,
      songId,
      userId
    );

    if (result === 0) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
} 