import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Fetch CSV data with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "rowIndex"
    const sortOrder = searchParams.get("sortOrder") || "asc"

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

    const skip = (page - 1) * limit

    // Build where clause for search
    const whereClause: any = { csvFileId: fileId }

    if (search) {
      // Search in JSON data - this is database-specific
      // For PostgreSQL with Prisma, you might need raw queries for complex JSON searches
      whereClause.OR = [
        {
          rowData: {
            path: [],
            string_contains: search,
          },
        },
      ]
    }

    const [rows, totalCount] = await Promise.all([
      prisma.csvRow.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.csvRow.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        rows,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
        csvFile,
      },
    })
  } catch (error) {
    console.error("Fetch data error:", error)
    return NextResponse.json({ error: "Failed to fetch CSV data" }, { status: 500 })
  }
}

// PUT - Update a specific row
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { rowId, rowData, userId } = body

    if (!rowId || !rowData || !userId) {
      return NextResponse.json({ error: "Row ID, data, and User ID required" }, { status: 400 })
    }

    // Verify ownership through the CSV file
    const row = await prisma.csvRow.findFirst({
      where: { id: rowId },
      include: { csvFile: true },
    })

    if (!row || row.csvFile.userId !== userId) {
      return NextResponse.json({ error: "Row not found or access denied" }, { status: 404 })
    }

    // Update the row
    const updatedRow = await prisma.csvRow.update({
      where: { id: rowId },
      data: { rowData },
    })

    return NextResponse.json({
      success: true,
      data: updatedRow,
    })
  } catch (error) {
    console.error("Update row error:", error)
    return NextResponse.json({ error: "Failed to update row" }, { status: 500 })
  }
}
