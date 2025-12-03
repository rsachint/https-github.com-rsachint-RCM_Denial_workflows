"use client"

import { FileCheck, CheckCircle2, XCircle, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClaimData } from "@/app/page"

interface MergedPdfPreviewProps {
  pdfUrl: string | null
  documentCount: number
  onApprove: () => void
  onReject: () => void
  claimData?: ClaimData | null
}

export function MergedPdfPreview({ pdfUrl, documentCount, onApprove, onReject, claimData }: MergedPdfPreviewProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Review Merged PDF</h3>
            <p className="text-sm text-muted-foreground">{documentCount} documents merged</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
            Ready for Review
          </Badge>
        </div>
      </div>

      {claimData && (
        <div className="px-5 py-3 border-b border-border bg-primary/5">
          <p className="text-sm text-muted-foreground">
            This merged document will be submitted to{" "}
            <span className="text-foreground font-medium">{claimData.payer}</span> to appeal the{" "}
            <span className="text-foreground font-medium">CARC {claimData.carcCode}</span> denial. Review the document
            below and approve to proceed with submission.
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-5 py-2 border-b border-border flex items-center gap-2 bg-secondary/20">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground mx-2">100%</span>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* PDF Preview */}
      <div className="h-[400px] bg-secondary/10 flex items-center justify-center p-4 overflow-auto">
        {pdfUrl && (
          <img
            src={pdfUrl || "/placeholder.svg"}
            alt="Merged PDF Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-border flex items-center justify-between">
        <Button variant="outline" onClick={onReject} className="gap-2 bg-transparent">
          <XCircle className="w-4 h-4" />
          Re-select Documents
        </Button>
        <Button onClick={onApprove} className="gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Approve & Submit to Payer
        </Button>
      </div>
    </div>
  )
}
