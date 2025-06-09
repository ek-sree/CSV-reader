"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, RotateCcw, Download, ArrowUpDown } from "lucide-react"

export function DataTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Sample data matching the Figma design
  const data = [
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      title: "CTO",
      company: "NexGen Software",
      email: "sjohnson@nexgensoftware.io",
      phone: "(408) 555-9876",
      location: "Palo Alto, CA",
      industry: "FinTech",
    },
    {
      id: "2",
      firstName: "Jennifer",
      lastName: "Lee",
      title: "CTO & Co-Founder",
      company: "EcoTech Innovations",
      email: "jennifer@ecotechinnovations.com",
      phone: "(510) 555-5678",
      location: "Oakland, CA",
      industry: "CleanTech",
    },
    {
      id: "3",
      firstName: "James",
      lastName: "Taylor",
      title: "CTO",
      company: "UrbanMobility",
      email: "jtaylor@urbanmobility.co",
      phone: "(628) 555-9090",
      location: "San Francisco, CA",
      industry: "Transportation",
    },
  ]

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    setSelectedRows(selectedRows.length === filteredData.length ? [] : filteredData.map((row) => row.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">California Tech CTOs - Q2 2025</h2>
          <p className="text-sm text-muted-foreground">{filteredData.length} records • 92% enriched</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox checked={selectedRows.length === filteredData.length} onCheckedChange={toggleAllRows} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  FIRST NAME
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  LAST NAME
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  TITLE
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  COMPANY
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  EMAIL
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  PHONE
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  LOCATION
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-1">
                  INDUSTRY
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={() => toggleRowSelection(row.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.company}</TableCell>
                <TableCell className="text-blue-600">{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.industry}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedRows.length} row{selectedRows.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Export Selected
            </Button>
            <Button size="sm" variant="outline">
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
