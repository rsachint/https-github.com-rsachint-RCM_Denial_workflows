"use client"

import { Bot, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { WorkflowStep, ClaimData } from "@/app/page"

interface AgentPanelProps {
  currentStep: WorkflowStep
  claim: ClaimData
}

export function AgentPanel({ currentStep, claim }: AgentPanelProps) {
  const isAIStep = currentStep.agentType === "ai"

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isAIStep ? "bg-primary/20" : "bg-accent/20"
            }`}
          >
            {isAIStep ? <Bot className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-accent" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {isAIStep ? "RCA Agent Analysis" : "Human Review Required"}
            </h3>
            <p className="text-sm text-muted-foreground">{currentStep.title}</p>
          </div>
        </div>
        <Badge
          variant={isAIStep ? "default" : "secondary"}
          className={isAIStep ? "bg-primary/20 text-primary border-0" : "bg-accent/20 text-accent border-0"}
        >
          {isAIStep ? "AI Processing" : "Awaiting Approval"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Denial Analysis */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Denial Analysis
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">CARC Code:</span>
              <span className="ml-2 font-mono text-foreground">{claim.carc}</span>
            </div>
            <div>
              <span className="text-muted-foreground">RARC Code:</span>
              <span className="ml-2 font-mono text-foreground">{claim.rarc}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">{claim.denialReason}</p>
        </div>

        {/* Suggested Resolution Steps */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Suggested Resolution Steps</h4>
          <div className="space-y-2">
            {[
              "Retrieve Chart Note for DOS 2024-01-15",
              "Retrieve Delivery Ticket for DOS 2024-01-15",
              "Verify provider details and patient information",
              "Merge documents and submit to payer portal",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
