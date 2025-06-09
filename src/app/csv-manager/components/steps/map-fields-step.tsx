"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MapFieldsStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function MapFieldsStep({ data, onUpdate, onNext, onBack }: MapFieldsStepProps) {
  const systemFields = [
    { key: "companyName", label: "Company Name", required: true },
    { key: "industry", label: "Industry", required: false },
    { key: "website", label: "Website", required: false },
    { key: "employeeCount", label: "Employee Count", required: false },
    { key: "annualRevenue", label: "Annual Revenue", required: false },
    { key: "country", label: "Country", required: false },
    { key: "state", label: "State/Province", required: false },
    { key: "city", label: "City", required: false },
  ]

  const handleFieldMapping = (systemField: string, csvColumn: string) => {
    onUpdate({
      ...data,
      fieldMappings: {
        ...data.fieldMappings,
        [systemField]: csvColumn,
      },
    })
  }

  const requiredFieldsMapped = systemFields
    .filter((field) => field.required)
    .every((field) => data.fieldMappings[field.key])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">
          Map your CSV columns to our system fields. Required fields are marked with an asterisk (*).
        </p>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-500 mb-4">SYSTEM FIELD</h3>
            <div className="space-y-4">
              {systemFields.map((field) => (
                <div key={field.key} className="py-3">
                  <Label className="text-base">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-500 mb-4">CSV COLUMN</h3>
            <div className="space-y-4">
              {systemFields.map((field) => (
                <div key={field.key}>
                  <Select
                    value={data.fieldMappings[field.key] || "none"}
                    onValueChange={(value) => handleFieldMapping(field.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Not Mapped --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Not Mapped --</SelectItem>
                      {data.csvColumns.map((column: string) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!requiredFieldsMapped}>
          Continue
        </Button>
      </div>
    </div>
  )
}
