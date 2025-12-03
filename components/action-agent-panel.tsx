"use client"

import { Loader2, FileSearch, Merge, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ClaimData } from "@/app/page"

interface ActionAgentPanelProps {
  status: "retrieving" | "merging" | "submitting"
  retryCount?: number
  claimData?: ClaimData | null
}

const statusConfig = {
  retrieving: {
    title: "Retrieving Documents",
    description: "Fetching documents from the PMS portal...",
    icon: FileSearch,
  },
  merging: {
    title: "Merging Documents",
    description: "Creating a merged PDF from selected documents...",
    icon: Merge,
  },
  submitting: {
    title: "Submitting to Payer Portal",
    description: "Uploading documentation and capturing submission proof...",
    icon: Send,
  },
}

export function ActionAgentPanel({ status, retryCount = 0, claimData }: ActionAgentPanelProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header - removed "Action Agent" label */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <StatusIcon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{config.title}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-accent/20 text-accent border-0">
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        </Badge>
      </div>

      {claimData && (
        <div className="px-5 py-3 border-b border-border bg-secondary/20">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Claim {claimData.claimId}</span> • {claimData.patientName} •{" "}
            {claimData.payer}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
          <StatusIcon className="w-8 h-8 text-accent animate-pulse" />
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">{config.title}</h4>
        <p className="text-sm text-muted-foreground max-w-sm">{config.description}</p>
        {retryCount > 0 && <p className="text-xs text-destructive mt-2">Retry attempt {retryCount}</p>}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
