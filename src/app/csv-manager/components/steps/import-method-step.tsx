"use client"

import { Button } from "@/components/ui/button"

interface ImportMethodStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ImportMethodStep({ data, onUpdate, onNext, onBack }: ImportMethodStepProps) {
  return (
    <div>
      <h2>Import Method Step</h2>
      <p>This step would allow the user to select an import method (e.g., upload file, paste data).</p>
      <Button onClick={onNext}>Continue</Button>
    </div>
  )
}
