import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, MoreHorizontal } from "lucide-react"
import type { ClaimData } from "@/app/page"

interface ClaimHeaderProps {
  claim: ClaimData
  currentStep: number
  totalSteps: number
}

export function ClaimHeader({ claim, currentStep, totalSteps }: ClaimHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">{claim.claimId}</h1>
              <Badge variant="destructive" className="text-xs">
                Denied - {claim.denialCode}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {claim.patientName} • DOS: {claim.dos} • CPT: {claim.cptCode} • {claim.payer}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ExternalLink className="w-4 h-4" />
            Open in PMS
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
