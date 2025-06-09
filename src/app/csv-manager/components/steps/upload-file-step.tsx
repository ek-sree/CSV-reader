"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, FileText, X } from "lucide-react"

interface UploadFileStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function UploadFileStep({ data, onUpdate, onNext }: UploadFileStepProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (file: File) => {
    if (file && file.type === "text/csv") {
      // Parse CSV to get columns and preview data
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        // Create preview data (first 3 rows)
        const previewData = lines.map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ""
          })
          return row
        })

        onUpdate({
          ...data,
          file,
          csvColumns: headers,
          previewData,
        })
      }
      reader.readAsText(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const removeFile = () => {
    onUpdate({
      ...data,
      file: null,
      csvColumns: [],
      previewData: [],
    })
  }

  const canContinue = data.batchName && data.file

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="batchName">Batch Name</Label>
          <Input
            id="batchName"
            value={data.batchName}
            onChange={(e) => onUpdate({ ...data, batchName: e.target.value })}
            placeholder="Enter batch name"
          />
        </div>

        <div>
          <Label>Batch Type</Label>
          <RadioGroup
            value={data.batchType}
            onValueChange={(value) => onUpdate({ ...data, batchType: value })}
            className="flex space-x-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Company" id="company" />
              <Label htmlFor="company">Company</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="People" id="people" />
              <Label htmlFor="people">People</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Upload CSV File</Label>
          {!data.file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
              <input type="file" accept=".csv" onChange={handleFileInput} className="hidden" id="file-upload" />
              <Button variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose file
                </label>
              </Button>
              <p className="text-xs text-gray-500 mt-2">No file chosen</p>
            </div>
          ) : (
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{data.file.name}</p>
                  <p className="text-sm text-gray-500">{Math.round(data.file.size / 1024)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost">Back</Button>
        <Button onClick={onNext} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
