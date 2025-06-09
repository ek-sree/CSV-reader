"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface CompleteStepProps {
  data: any
  onComplete: () => void
}

export function CompleteStep({ data, onComplete }: CompleteStepProps) {
  console.log("DATA comp",data);
  
  return (
    <div className="text-center space-y-8 py-12">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Batch Import Successful</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your batch "{data.batchName}" has been successfully imported and is now available in your batches list.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 space-y-4 max-w-md mx-auto">
        <div className="flex justify-between text-lg">
          <span className="font-medium">Batch Name:</span>
          <span className="font-semibold">{data.batchName}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Type:</span>
          <span className="font-semibold">{data.batchType}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Records:</span>
          <span className="font-semibold">{data.previewData.length}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-8">
        <Button variant="outline" size="lg" className="px-8">
          Back to Lists & Batches
        </Button>
        <Button variant="outline" size="lg" className="px-8">
          Import Another Batch
        </Button>
        <Button onClick={onComplete} className="bg-black text-white hover:bg-gray-800" size="lg" className="px-8">
          Continue
        </Button>
      </div>
    </div>
  )
}
