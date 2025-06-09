import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { readFile } from "fs/promises"
import { join } from "path"
import { parse } from "csv-parse/sync"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, batchName, batchType, fieldMappings, userId } = body

    // Read the uploaded CSV file
    const filepath = join(process.cwd(), "uploads", filename)
    const csvContent = await readFile(filepath, "utf-8")

    // Parse CSV data
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    const headers = Object.keys(records[0] || {})

    // Create CSV file record in database
    const csvFile = await prisma.csvFile.create({
      data: {
        userId,
        fileName: batchName,
        originalName: filename,
        columnHeaders: headers,
        rowCount: records.length,
        batchType,
        fieldMappings: fieldMappings || {},
      },
    })

    // Create CSV row records
    const csvRows = records.map((record: any, index: number) => ({
      csvFileId: csvFile.id,
      rowData: record,
      rowIndex: index,
    }))

    await prisma.csvRow.createMany({
      data: csvRows,
    })

    return NextResponse.json({
      success: true,
      data: {
        csvFileId: csvFile.id,
        rowsImported: records.length,
      },
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Failed to import CSV data" }, { status: 500 })
  }
}
