"use client"

import { useState } from "react"
import { FileText, Eye, CheckSquare, Square, ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DocumentItem, ClaimData } from "@/app/page"
import { PdfViewerModal } from "@/components/pdf-viewer-modal"

interface DocumentReviewPanelProps {
  documents: DocumentItem[]
  selectedDocuments: string[]
  onDocumentSelect: (docId: string) => void
  onConfirm: () => void
  onNotRelevant: () => void
  claimData?: ClaimData | null
}

export function DocumentReviewPanel({
  documents,
  selectedDocuments,
  onDocumentSelect,
  onConfirm,
  onNotRelevant,
  claimData,
}: DocumentReviewPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Chart Notes", "Delivery Ticket"])
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)

  // Group documents by category
  const groupedDocs = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = []
      acc[doc.category].push(doc)
      return acc
    },
    {} as Record<string, DocumentItem[]>,
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <FileText className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Review Documents</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDocuments.length} of {documents.length} selected
              </p>
            </div>
          </div>
        </div>

        {claimData && (
          <div className="px-5 py-3 border-b border-border bg-primary/5">
            <p className="text-sm text-muted-foreground">
              Documents retrieved for <span className="text-foreground font-medium">CARC {claimData.carcCode}</span> /{" "}
              <span className="text-foreground font-medium">RARC {claimData.rarcCode}</span> denial. Select all relevant
              documents to support the claim appeal.
            </p>
          </div>
        )}

        {/* Document List - Hierarchical like Brightree */}
        <div className="max-h-[400px] overflow-y-auto">
          {Object.entries(groupedDocs).map(([category, docs]) => (
            <div key={category} className="border-b border-border last:border-0">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-5 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                {expandedCategories.includes(category) ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">{category}</span>
                <span className="text-xs text-muted-foreground">({docs.length})</span>
              </button>

              {/* Documents in category */}
              {expandedCategories.includes(category) && (
                <div className="divide-y divide-border">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "flex items-center gap-4 px-5 py-3 pl-10 hover:bg-secondary/20 cursor-pointer transition-colors",
                        selectedDocuments.includes(doc.id) && "bg-primary/5",
                      )}
                      onClick={() => onDocumentSelect(doc.id)}
                    >
                      <button className="shrink-0">
                        {selectedDocuments.includes(doc.id) ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.provider}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.date} • {doc.name}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewDoc(doc)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between">
          <Button variant="outline" onClick={onNotRelevant} className="gap-2 bg-transparent">
            <AlertCircle className="w-4 h-4" />
            Documents Not Relevant
          </Button>
          <Button onClick={onConfirm} disabled={selectedDocuments.length === 0} className="gap-2">
            Confirm Selection ({selectedDocuments.length})
          </Button>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PdfViewerModal document={previewDoc} onClose={() => setPreviewDoc(null)} />
    </>
  )
}
