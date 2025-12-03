"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ClaimData, DocumentItem } from "@/app/page"

interface CaseNotesPanelProps {
  claimData: ClaimData | null
  onSubmit: (notes: string) => void
  selectedDocuments?: string[]
  documents?: DocumentItem[]
}

export function CaseNotesPanel({ claimData, onSubmit, selectedDocuments = [], documents = [] }: CaseNotesPanelProps) {
  const selectedDocNames = documents.filter((d) => selectedDocuments.includes(d.id)).map((d) => d.name)

  const generateDefaultSummary = () => {
    if (!claimData) return ""

    const resolutionStepsSummary = claimData.resolutionSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")

    const documentsList =
      selectedDocNames.length > 0
        ? selectedDocNames.map((name) => `  - ${name}`).join("\n")
        : "  - No documents selected"

    return `CLAIM RESOLUTION SUMMARY
========================

Claim ID: ${claimData.claimId}
Patient: ${claimData.patientName}
Date of Service: ${claimData.dos}
Provider: ${claimData.provider}
Payer: ${claimData.payer}

DENIAL INFORMATION
------------------
CARC Code: ${claimData.carcCode}
RARC Code: ${claimData.rarcCode}
Denial Reason: ${claimData.denialReason}

RECOMMENDED RESOLUTION STEPS
----------------------------
${resolutionStepsSummary}

EXECUTION SUMMARY
-----------------
1. Retrieved medical record documents from PMS portal
2. Documents verified for relevance, completeness, and correctness
3. Documents merged into single PDF for submission
4. Merged PDF uploaded to ${claimData.payer} payer portal
5. Case ID snapshot captured as proof of submission
6. All documents submitted to PMS portal under Appeals category

DOCUMENTS INCLUDED
------------------
${documentsList}

ADDITIONAL NOTES
----------------
`
  }

  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (claimData && notes === "") {
      setNotes(generateDefaultSummary())
    }
  }, [claimData])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Final Review & Case Notes</h3>
          <p className="text-sm text-muted-foreground">Review and edit the summary before submitting to PMS portal</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <label htmlFor="case-notes" className="text-sm font-medium text-foreground">
            Case Notes Summary
          </label>
          <p className="text-xs text-muted-foreground">
            This summary is auto-generated based on the resolution workflow. You can edit it before submission.
          </p>
          <Textarea
            id="case-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[400px] bg-secondary/50 border-border resize-none font-mono text-sm"
          />
        </div>

        <Button onClick={() => onSubmit(notes)} className="w-full gap-2">
          <Send className="w-4 h-4" />
          Save & Submit to PMS Portal
        </Button>
      </div>
    </div>
  )
}
