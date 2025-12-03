import { cn } from "@/lib/utils"
import { Check, Loader2, AlertCircle, Circle } from "lucide-react"
import type { WorkflowPhase } from "@/app/page"

interface WorkflowProgressProps {
  phase: WorkflowPhase
}

type Step = {
  id: string
  title: string
  phases: WorkflowPhase[]
}

const steps: Step[] = [
  { id: "1", title: "Claim Analysis", phases: ["nba-processing"] },
  { id: "2", title: "Approve Resolution", phases: ["nba-approval"] },
  { id: "3", title: "Retrieve Documents", phases: ["action-retrieving-docs"] },
  { id: "4", title: "Review Documents", phases: ["doc-review", "smartsheets"] },
  { id: "5", title: "Merge Documents", phases: ["action-merging"] },
  { id: "6", title: "Review Merged PDF", phases: ["merge-review"] },
  { id: "7", title: "Submit to Payer Portal", phases: ["action-submitting"] },
  { id: "8", title: "Final Review & Case Notes", phases: ["case-notes"] },
]

const phaseOrder: WorkflowPhase[] = [
  "nba-processing",
  "nba-approval",
  "action-retrieving-docs",
  "doc-review",
  "smartsheets",
  "action-merging",
  "merge-review",
  "action-submitting",
  "case-notes",
  "completed",
]

export function WorkflowProgress({ phase }: WorkflowProgressProps) {
  const currentPhaseIndex = phaseOrder.indexOf(phase)

  const getStepStatus = (step: Step) => {
    if (phase === "completed") return "completed"
    if (phase === "manual-flow") return "error"

    const stepPhaseIndices = step.phases.map((p) => phaseOrder.indexOf(p))
    const minStepIndex = Math.min(...stepPhaseIndices)
    const maxStepIndex = Math.max(...stepPhaseIndices)

    if (currentPhaseIndex > maxStepIndex) return "completed"
    if (currentPhaseIndex >= minStepIndex && currentPhaseIndex <= maxStepIndex) return "in-progress"
    return "pending"
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Workflow Progress</h3>
      <div className="space-y-1">
        {steps.map((step, index) => {
          const status = getStepStatus(step)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="relative">
              <div
                className={cn(
                  "flex items-start gap-3 p-2 rounded-lg transition-colors",
                  status === "in-progress" && "bg-secondary",
                )}
              >
                {/* Step indicator */}
                <div className="relative">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      status === "completed" && "bg-primary text-primary-foreground",
                      status === "in-progress" && "bg-accent text-accent-foreground ring-2 ring-accent/30",
                      status === "pending" && "bg-secondary text-muted-foreground",
                      status === "error" && "bg-destructive text-destructive-foreground",
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : status === "in-progress" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : status === "error" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-1/2 top-8 w-0.5 h-6 -translate-x-1/2",
                        status === "completed" ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      status === "in-progress" ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
