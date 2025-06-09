"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { CompleteStep } from "./steps/complete-steps"
import { UploadFileStep } from "./steps/upload-file-step"
import { MapFieldsStep } from "./steps/map-fields-step"
import { ReviewStep } from "./steps/review-step"


interface ImportWizardProps {
  onClose: () => void
  onComplete: (file: any) => void
}

export function ImportWizard({ onClose, onComplete }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [importData, setImportData] = useState({
    method: "",
    batchName: "",
    batchType: "People",
    file: null as File | null,
    fieldMappings: {} as Record<string, string>,
    csvColumns: [] as string[],
    previewData: [] as any[],
  })

  const steps = [
    { number: 1, title: "Upload File", component: UploadFileStep },
    { number: 2, title: "Map Fields", component: MapFieldsStep },
    { number: 3, title: "Review", component: ReviewStep },
    { number: 4, title: "Complete", component: CompleteStep },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    const newFile = {
      id: Date.now().toString(),
      fileName: importData.batchName,
      originalName: importData.file?.name || "",
      uploadedAt: new Date(),
      rowCount: importData.previewData.length,
      columnHeaders: importData.csvColumns,
      fieldMapping: importData.fieldMappings,
      previewData: importData.previewData
    }
    console.log("DA",newFile);
    
    onComplete(newFile)
  }

  const StepComponent = steps[currentStep - 1]?.component

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Import Batch</DialogTitle>
          {/* <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 py-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.number
                    ? "bg-black text-white"
                    : currentStep > step.number
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <span className={`ml-2 text-sm ${currentStep >= step.number ? "text-black" : "text-gray-500"}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-4 ${currentStep > step.number ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {StepComponent && (
            <StepComponent
              data={importData}
              onUpdate={setImportData}
              onNext={handleNext}
              onBack={handleBack}
              onComplete={handleComplete}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
