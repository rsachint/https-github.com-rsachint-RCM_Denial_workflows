"use client"

import { X, Download, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DocumentItem } from "@/app/page"

interface PdfViewerModalProps {
  document: DocumentItem | null
  onClose: () => void
}

export function PdfViewerModal({ document, onClose }: PdfViewerModalProps) {
  if (!document) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[90vh] bg-card rounded-xl border border-border flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{document.name}</h3>
            <p className="text-sm text-muted-foreground">
              {document.provider} • {document.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto p-4 bg-secondary/20">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={`/.jpg?height=800&width=600&query=${encodeURIComponent(document.category + " medical document " + document.code)}`}
              alt={document.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
