import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { parse } from "csv-parse/sync"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const batchName = formData.get("batchName") as string
    const batchType = formData.get("batchType") as string
    const userId = formData.get("userId") as string // In real app, get from auth session

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Parse CSV to get headers and preview data
    const csvContent = buffer.toString("utf-8")
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    const headers = Object.keys(records[0] || {})
    const previewData = records.slice(0, 5) // First 5 rows for preview

    return NextResponse.json({
      success: true,
      data: {
        filename,
        originalName: file.name,
        headers,
        previewData,
        totalRows: records.length,
        batchName,
        batchType,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
