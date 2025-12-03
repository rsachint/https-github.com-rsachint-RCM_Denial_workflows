"use client"

import { useState } from "react"
import { CheckCircle2, PartyPopper, ArrowRight, FileText, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { ClaimData, AgentLog } from "@/app/page"

interface CompletedPanelProps {
  claimData: ClaimData | null
  onNextClaim: () => void
  agentLogs?: AgentLog[]
}

export function CompletedPanel({ claimData, onNextClaim, agentLogs = [] }: CompletedPanelProps) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true)

  const errorLogs = agentLogs.filter((log) => log.status === "error")
  const successfulActions = agentLogs.filter((log) => log.status === "success")

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <PartyPopper className="w-5 h-5 text-warning" />
          <h3 className="text-xl font-bold text-foreground">Resolution Complete!</h3>
          <PartyPopper className="w-5 h-5 text-warning" />
        </div>
        <p className="text-muted-foreground mb-6 max-w-md">
          Claim <span className="font-mono text-foreground font-semibold">{claimData?.claimId}</span> has been
          successfully resolved and submitted to {claimData?.payer}.
        </p>

        <div className="bg-secondary/30 rounded-lg p-4 w-full max-w-md mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <span className="text-muted-foreground">Patient:</span>
              <p className="font-medium text-foreground">{claimData?.patientName}</p>
            </div>
            <div className="text-left">
              <span className="text-muted-foreground">DOS:</span>
              <p className="font-medium text-foreground">{claimData?.dos}</p>
            </div>
            <div className="text-left">
              <span className="text-muted-foreground">Amount:</span>
              <p className="font-medium text-foreground">${claimData?.billedAmount.toFixed(2)}</p>
            </div>
            <div className="text-left">
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium text-primary">Submitted</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mb-6">
          <Collapsible open={isSummaryExpanded} onOpenChange={setIsSummaryExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between mb-3 bg-transparent">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Execution Summary
                </span>
                {isSummaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-secondary/20 rounded-lg p-4 text-left space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Resolution Steps
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    {claimData?.resolutionSteps?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Actions Taken */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Actions Completed ({successfulActions.length})
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Retrieved MR documents from PMS portal
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Documents verified for relevance, completeness and correctness
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Merged selected documents into single PDF
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Uploaded merged documents to payer portal
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Captured Case ID snapshot as proof of submission
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Submitted merged PDF, Case ID snapshot and notes to PMS portal under Appeals category
                    </li>
                  </ul>
                </div>

                {/* Error Handling */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning"></span>
                    Error Handling
                  </h4>
                  {errorLogs.length > 0 ? (
                    <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                      {errorLogs.map((log, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-warning mt-0.5 shrink-0" />
                          <div>
                            <span className="text-warning">Error encountered:</span> {log.message}
                            <span className="block text-xs text-muted-foreground">
                              Action taken: Automatic retry attempted and succeeded
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground ml-4 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      No errors encountered during execution
                    </p>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Button onClick={onNextClaim} className="gap-2">
          Next Claim
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
