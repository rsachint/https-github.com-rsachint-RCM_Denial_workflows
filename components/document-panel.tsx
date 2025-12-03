"use client"

import { FileText, Download, Eye, CheckSquare, Square, Merge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DocumentPanelProps {
  selectedDocuments: string[]
  onDocumentSelect: (docs: string[]) => void
  currentStep: number
}

const documents = [
  { id: "1", name: "Chart Note - 2024-01-15", type: "Chart Note", status: "available", size: "245 KB" },
  { id: "2", name: "Delivery Ticket - 2024-01-15", type: "Delivery Ticket", status: "available", size: "128 KB" },
  { id: "3", name: "EOB - BCBS", type: "EOB", status: "available", size: "89 KB" },
  { id: "4", name: "Prior Authorization", type: "Authorization", status: "missing", size: "-" },
]

export function DocumentPanel({ selectedDocuments, onDocumentSelect, currentStep }: DocumentPanelProps) {
  const toggleDocument = (id: string) => {
    if (selectedDocuments.includes(id)) {
      onDocumentSelect(selectedDocuments.filter((d) => d !== id))
    } else {
      onDocumentSelect([...selectedDocuments, id])
    }
  }

  const selectAll = () => {
    const available = documents.filter((d) => d.status === "available").map((d) => d.id)
    onDocumentSelect(available)
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <FileText className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Documents</h3>
            <p className="text-sm text-muted-foreground">
              {selectedDocuments.length} of {documents.filter((d) => d.status === "available").length} selected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button size="sm" className="gap-2" disabled={selectedDocuments.length === 0}>
            <Merge className="w-4 h-4" />
            Merge PDF
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              "flex items-center gap-4 px-5 py-3 transition-colors",
              doc.status === "available" ? "hover:bg-secondary/30 cursor-pointer" : "opacity-50",
              selectedDocuments.includes(doc.id) && "bg-primary/5",
            )}
            onClick={() => doc.status === "available" && toggleDocument(doc.id)}
          >
            <button className="shrink-0">
              {selectedDocuments.includes(doc.id) ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : (
                <Square className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {doc.type} • {doc.size}
              </p>
            </div>
            {doc.status === "available" ? (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <span className="text-xs text-destructive font-medium">Missing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
