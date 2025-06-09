import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Fetch all CSV files for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const csvFiles = await prisma.csvFile.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
      include: {
        _count: {
          select: { rows: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: csvFiles,
    })
  } catch (error) {
    console.error("Fetch files error:", error)
    return NextResponse.json({ error: "Failed to fetch CSV files" }, { status: 500 })
  }
}

// DELETE - Delete a CSV file and its rows
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    const userId = searchParams.get("userId")

    if (!fileId || !userId) {
      return NextResponse.json({ error: "File ID and User ID required" }, { status: 400 })
    }

    // Verify ownership
    const csvFile = await prisma.csvFile.findFirst({
      where: { id: fileId, userId },
    })

    if (!csvFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Delete rows first (due to foreign key constraint)
    await prisma.csvRow.deleteMany({
      where: { csvFileId: fileId },
    })

    // Delete the file record
    await prisma.csvFile.delete({
      where: { id: fileId },
    })

    return NextResponse.json({
      success: true,
      message: "CSV file deleted successfully",
    })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete CSV file" }, { status: 500 })
  }
}
