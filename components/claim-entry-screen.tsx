"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bot, Search, AlertCircle, Loader2 } from "lucide-react"
import type { ClaimData } from "@/app/page"

interface ClaimEntryScreenProps {
  onClaimValidated: (claimData: ClaimData) => void
}

const MOCK_CLAIM_DATABASE: Record<string, ClaimData> = {
  "440553": {
    claimId: "440553",
    patientName: "Joel Ross",
    dos: "2024-10-23",
    provider: "Voyage Medical Solutions LLC",
    payer: "Blue Cross Blue Shield",
    carcCode: "252",
    rarcCode: "M127",
    denialReason: "Additional documentation/information is needed to process this claim.",
    resolutionSteps: [
      "Pull relevant MR (Medical Record) documents from PMS portal",
      "Verify documents for relevance, completeness and correctness",
      "Merge the verified documents into a single PDF",
      "Upload merged documents to payer portal",
      "Take Case ID snapshot (proof of documents uploaded) from payer portal",
      "Submit merged documents, Case ID snapshot and notes to PMS portal under 'Appeals' category in document tab",
    ],
    billedAmount: 2000.0,
  },
  "440554": {
    claimId: "440554",
    patientName: "Sarah Mitchell",
    dos: "2024-10-15",
    provider: "Voyage Medical Solutions LLC",
    payer: "Aetna",
    carcCode: "197",
    rarcCode: "N479",
    denialReason: "Precertification/authorization/notification absent.",
    resolutionSteps: [
      "Pull relevant MR (Medical Record) documents from PMS portal",
      "Verify documents for relevance, completeness and correctness",
      "Merge the verified documents into a single PDF",
      "Upload merged documents to payer portal",
      "Take Case ID snapshot (proof of documents uploaded) from payer portal",
      "Submit merged documents, Case ID snapshot and notes to PMS portal under 'Appeals' category in document tab",
    ],
    billedAmount: 3500.0,
  },
  "440555": {
    claimId: "440555",
    patientName: "Michael Chen",
    dos: "2024-10-20",
    provider: "Voyage Medical Solutions LLC",
    payer: "United Healthcare",
    carcCode: "16",
    rarcCode: "M76",
    denialReason: "Claim/service lacks information or has submission/billing error(s).",
    resolutionSteps: [
      "Pull relevant MR (Medical Record) documents from PMS portal",
      "Verify documents for relevance, completeness and correctness",
      "Merge the verified documents into a single PDF",
      "Upload merged documents to payer portal",
      "Take Case ID snapshot (proof of documents uploaded) from payer portal",
      "Submit merged documents, Case ID snapshot and notes to PMS portal under 'Appeals' category in document tab",
    ],
    billedAmount: 1250.0,
  },
}

export function ClaimEntryScreen({ onClaimValidated }: ClaimEntryScreenProps) {
  const [claimId, setClaimId] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateClaimIdFormat = (id: string): boolean => {
    // Claim ID is a series of numbers only
    const pattern = /^\d+$/
    return pattern.test(id)
  }

  const handleSubmit = async () => {
    setError(null)

    if (!claimId.trim()) {
      setError("Please enter a Claim ID")
      return
    }

    if (!validateClaimIdFormat(claimId.trim())) {
      setError("Invalid Claim ID format. Claim ID should contain numbers only (e.g., 440553)")
      return
    }

    setIsValidating(true)

    // Simulate database lookup
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const claimData = MOCK_CLAIM_DATABASE[claimId.trim()]

    if (!claimData) {
      setIsValidating(false)
      setError("Claim ID is invalid or claim information does not exist in the database. Please verify and try again.")
      return
    }

    setIsValidating(false)
    onClaimValidated(claimData)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">RCM Claim Resolution</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter a Claim ID to start the AI-assisted resolution workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <label htmlFor="claim-id" className="text-sm font-medium text-foreground">
              Claim ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="claim-id"
                placeholder="440553"
                value={claimId}
                onChange={(e) => {
                  setClaimId(e.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="pl-10 bg-secondary/50 border-border h-12 text-lg font-mono"
                disabled={isValidating}
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 text-destructive text-sm mt-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isValidating || !claimId.trim()}
            className="w-full h-12 text-base gap-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Retrieving Claim Information...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                Start Resolution Workflow
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The NBA Agent will analyze the claim denial and suggest resolution steps for your approval.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
