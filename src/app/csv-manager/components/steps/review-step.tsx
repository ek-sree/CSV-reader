"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ReviewStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ReviewStep({ data, onNext, onBack }: ReviewStepProps) {
  const mappedFields = Object.entries(data.fieldMappings).filter(([_, value]) => value)
console.log("REVIEW data",data);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Batch Name</p>
              <p className="font-medium">{data.batchName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">File</p>
              <p className="font-medium">{data.file?.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Batch Type</p>
              <p className="font-medium">{data.batchType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Records</p>
              <p className="font-medium">{data.previewData.length} (preview)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-500 mb-3">SYSTEM FIELD</h4>
              {mappedFields.map(([systemField]) => (
                <p key={systemField} className="py-1 capitalize">
                  {systemField.replace(/([A-Z])/g, " $1").trim()}
                </p>
              ))}
            </div>
            <div>
              <h4 className="font-medium text-gray-500 mb-3">CSV COLUMN</h4>
              {mappedFields.map(([_, csvColumn]) => (
                <p key={csvColumn} className="py-1">
                  {csvColumn}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg">Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {mappedFields.map(([_, csvColumn]) => (
                  <TableHead key={csvColumn}>{csvColumn}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.previewData.map((row: any, index: number) => (
                <TableRow key={index}>
                  {mappedFields.map(([_, csvColumn]) => (
                    <TableCell key={csvColumn}>{row[csvColumn] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-black text-white hover:bg-gray-800">
          Import Batch
        </Button>
      </div>
    </div>
  )
}
