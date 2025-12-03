"use client"

import { AlertTriangle, CheckCircle2, Loader2, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ClaimData } from "@/app/page"

interface NbaAgentPanelProps {
  claimData: ClaimData | null
  isProcessing: boolean
  onApprove: () => void
  onReject: () => void
}

export function NbaAgentPanel({ claimData, isProcessing, onApprove, onReject }: NbaAgentPanelProps) {
  if (!claimData) return null

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header - Removed agent labels */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {isProcessing ? "Analyzing Claim" : "Claim Analysis Complete"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isProcessing
                ? "Retrieving denial information and resolution steps..."
                : "Review the analysis and approve to continue"}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={isProcessing ? "bg-accent/20 text-accent border-0" : "bg-primary/20 text-primary border-0"}
        >
          {isProcessing ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing
            </span>
          ) : (
            "Ready for Review"
          )}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {!isProcessing && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="text-sm font-medium text-foreground mb-2">Analysis Summary</h4>
            <p className="text-sm text-muted-foreground">
              Claim <span className="font-mono text-foreground font-semibold">{claimData.claimId}</span> for patient{" "}
              <span className="text-foreground font-medium">{claimData.patientName}</span> was denied by{" "}
              <span className="text-foreground font-medium">{claimData.payer}</span>. The denial is due to missing or
              insufficient documentation. The recommended resolution involves pulling relevant Medical Record documents
              from the PMS portal, verifying and merging them, uploading to the payer portal, capturing proof of
              submission, and submitting all documents to PMS under the Appeals category.
            </p>
          </div>
        )}

        {/* Denial Analysis */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Denial Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <span className="text-muted-foreground">CARC Code:</span>
              <span className="ml-2 font-mono text-foreground font-semibold">{claimData.carcCode}</span>
            </div>
            <div>
              <span className="text-muted-foreground">RARC Code:</span>
              <span className="ml-2 font-mono text-foreground font-semibold">{claimData.rarcCode}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Denial Reason:</span>
            <p className="text-sm text-foreground mt-1">{claimData.denialReason}</p>
          </div>
        </div>

        {/* Resolution Steps */}
        {!isProcessing && claimData.resolutionSteps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Recommended Resolution Steps</h4>
            <div className="space-y-2">
              {claimData.resolutionSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isProcessing && (
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button onClick={onApprove} className="flex-1 gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Approve & Continue
            </Button>
            <Button variant="outline" onClick={onReject} className="bg-transparent">
              Revert to Manual Flow
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
