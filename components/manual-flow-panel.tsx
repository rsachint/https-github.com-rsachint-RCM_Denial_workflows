"use client"

import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ClaimData } from "@/app/page"

interface ManualFlowPanelProps {
  claimData: ClaimData | null
  onBackToQueue: () => void
}

export function ManualFlowPanel({ claimData, onBackToQueue }: ManualFlowPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-warning" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Reverted to Manual Flow</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          The AI-assisted workflow has been stopped. Please proceed with manual claim resolution for{" "}
          <span className="font-mono text-foreground font-semibold">{claimData?.claimId}</span>.
        </p>

        {claimData && claimData.resolutionSteps.length > 0 && (
          <div className="bg-secondary/30 rounded-lg p-4 w-full max-w-md mb-6 text-left">
            <h4 className="text-sm font-medium text-foreground mb-3">Suggested Next Steps</h4>
            <ul className="space-y-2">
              {claimData.resolutionSteps.map((step, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-foreground font-medium">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onBackToQueue} variant="outline" className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Claims Queue
        </Button>
      </div>
    </div>
  )
}
