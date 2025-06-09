"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Database, Plus } from "lucide-react"
import { DataTable } from "./components/data-table"
import { ImportWizard } from "./components/import-wizard"
import { format } from 'date-fns';
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CSVManagerPage() {
  const [showImportWizard, setShowImportWizard] = useState(false)
  const [csvFiles, setCsvFiles] = useState([
    {
      id: "1",
      fileName: "California Tech CTOs - Q2 2025",
      originalName: "tech-ctos.csv",
      uploadedAt: new Date("2024-01-15"),
      rowCount: 156,
      columnHeaders: ["FIRST_NAME", "LAST_NAME", "TITLE", "COMPANY", "EMAIL", "PHONE", "LOCATION", "INDUSTRY"],
    },
  ])

  const {isSignedIn} = useAuth()
  const router = useRouter();

  useEffect(() => {
    
  if (isSignedIn) {
    console.log("IS callign");
    
    fetch("/api/auth/sync-user", { method: "POST" });
  }
}, [isSignedIn]);

  const handleImportClick =()=>{
    if(!isSignedIn){
       router.push('/sign-in')
       return
    }
    setShowImportWizard(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CSV Manager</h1>
          <p className="text-muted-foreground">Import and manage your CSV data</p>
        </div>

        <div className="gap-2 flex">
        <Button onClick={handleImportClick} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Import Batch
        </Button>
         <SignedOut>
              <SignInButton>
                <Button className="cursor-pointer" variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
              afterSignOutUrl="/csv-manager"
              appearance={{
                elements: {
                  avatarBox: "w-30 h-20",
                },
              }}
              />
            </SignedIn>
        </div>
      </div>

      {csvFiles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Database className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No CSV files uploaded</h3>
              <p className="text-muted-foreground">Get started by importing your first batch</p>
            </div>
            <Button onClick={() => setShowImportWizard(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Import Your First Batch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {csvFiles.map((file) => (
              <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{file.fileName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{file.originalName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Records:</span>
                      <span className="font-medium">{file.rowCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span className="font-medium">{format(file.uploadedAt,'MM/dd/yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DataTable />
        </div>
      )}

      {showImportWizard && (
        <ImportWizard
          onClose={() => setShowImportWizard(false)}
          onComplete={(newFile) => {
            setCsvFiles([...csvFiles, newFile])
            setShowImportWizard(false)
          }}
        />
      )}
    </div>
  )
}
