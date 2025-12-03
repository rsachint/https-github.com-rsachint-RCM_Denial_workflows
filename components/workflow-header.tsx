"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { ClaimData, WorkflowPhase } from "@/app/page"

interface WorkflowHeaderProps {
  claimData: ClaimData | null
  phase: WorkflowPhase
  onBackToQueue: () => void
  totalClaims?: number
  currentClaimNumber?: number
}

const phaseLabels: Record<WorkflowPhase, string> = {
  "nba-processing": "NBA Agent Processing",
  "nba-approval": "Awaiting Approval",
  "action-retrieving-docs": "Retrieving Documents",
  "doc-review": "Document Review",
  smartsheets: "Client Communication",
  "action-merging": "Merging Documents",
  "merge-review": "Review Merged PDF",
  "action-submitting": "Submitting to Payer",
  "case-notes": "Add Case Notes",
  completed: "Completed",
  "manual-flow": "Manual Flow",
}

export function WorkflowHeader({
  claimData,
  phase,
  onBackToQueue,
  totalClaims,
  currentClaimNumber,
}: WorkflowHeaderProps) {
  if (!claimData) return null

  const isProcessing = ["nba-processing", "action-retrieving-docs", "action-merging", "action-submitting"].includes(
    phase,
  )

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">{claimData.claimId}</h1>
              <Badge variant="destructive" className="text-xs">
                Denied - CARC {claimData.carcCode}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-xs ${isProcessing ? "bg-accent/20 text-accent animate-pulse" : "bg-secondary"}`}
              >
                {phaseLabels[phase]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {claimData.patientName} • DOS: {claimData.dos} • {claimData.payer}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {totalClaims && currentClaimNumber && (
            <div className="text-sm text-muted-foreground">
              Processing claim <span className="font-semibold text-foreground">{currentClaimNumber}</span> of{" "}
              <span className="font-semibold text-foreground">{totalClaims}</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={onBackToQueue} className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back to Queue
          </Button>
        </div>
      </div>
    </header>
  )
}
