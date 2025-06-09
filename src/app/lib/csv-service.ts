// Service layer for CSV operations
export class CSVService {
  static async uploadFile(formData: FormData) {
    const response = await fetch("/api/csv/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload file")
    }

    return response.json()
  }

  static async importCSV(importData: any) {
    const response = await fetch("/api/csv/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(importData),
    })

    if (!response.ok) {
      throw new Error("Failed to import CSV")
    }

    return response.json()
  }

  static async getCSVFiles(userId: string) {
    const response = await fetch(`/api/csv/files?userId=${userId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch CSV files")
    }

    return response.json()
  }

  static async getCSVData(
    fileId: string,
    userId: string,
    params?: {
      page?: number
      limit?: number
      search?: string
      sortBy?: string
      sortOrder?: string
    },
  ) {
    const searchParams = new URLSearchParams({
      fileId,
      userId,
      ...Object.fromEntries(Object.entries(params || {}).map(([key, value]) => [key, String(value)])),
    })

    const response = await fetch(`/api/csv/data?${searchParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch CSV data")
    }

    return response.json()
  }

  static async updateRow(rowId: string, rowData: any, userId: string) {
    const response = await fetch("/api/csv/data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rowId, rowData, userId }),
    })

    if (!response.ok) {
      throw new Error("Failed to update row")
    }

    return response.json()
  }

  static async deleteFile(fileId: string, userId: string) {
    const response = await fetch(`/api/csv/files?fileId=${fileId}&userId=${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete file")
    }

    return response.json()
  }
}
