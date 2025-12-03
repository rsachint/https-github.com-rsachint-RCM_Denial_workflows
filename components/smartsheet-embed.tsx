"use client"

import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ClaimData } from "@/app/page"

interface SmartsheetEmbedProps {
  onBack: () => void
  claimData?: ClaimData | null
}

const SMARTSHEETS_URL = "https://app.smartsheet.com"

export function SmartsheetEmbed({ onBack, claimData }: SmartsheetEmbedProps) {
  const openSmartsheets = () => {
    window.open(SMARTSHEETS_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="font-semibold text-foreground">Client Communication</h3>
            <p className="text-sm text-muted-foreground">Request additional documents from the client</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={openSmartsheets}>
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </Button>
      </div>

      {claimData && (
        <div className="px-5 py-3 border-b border-border bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              The retrieved documents are not relevant for claim{" "}
              <span className="text-foreground font-mono">{claimData.claimId}</span>. Use Smartsheets to communicate
              with the client and request the correct documentation for the{" "}
              <span className="text-foreground font-medium">CARC {claimData.carcCode}</span> denial.
            </p>
          </div>
        </div>
      )}

      {/* Embed Placeholder */}
      <div className="h-[500px] bg-secondary/20 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center mb-6">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-muted-foreground" fill="currentColor">
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">Smartsheets Integration</h4>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
          Use this space to communicate with the client and request additional documentation needed for claim
          resolution.
        </p>
        <Button size="lg" className="gap-2 mb-6" onClick={openSmartsheets}>
          <ExternalLink className="w-5 h-5" />
          Go to Smartsheets
        </Button>
        <div className="bg-secondary/50 rounded-lg p-4 w-full max-w-lg text-center">
          <p className="text-xs text-muted-foreground">
            Click the button above to open Smartsheets in a new browser tab and communicate with the client.
          </p>
        </div>
      </div>
    </div>
  )
}
