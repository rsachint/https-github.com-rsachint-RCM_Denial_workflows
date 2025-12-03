"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import type { WorkflowStep } from "@/app/page"

interface ActionPanelProps {
  currentStep: WorkflowStep
  onApprove: () => void
  onReject: () => void
}

export function ActionPanel({ currentStep, onApprove, onReject }: ActionPanelProps) {
  const [notes, setNotes] = useState("")
  const isHumanStep = currentStep.agentType === "human"

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        {isHumanStep ? "Review & Approve" : "Add Notes"}
      </h3>

      <div className="space-y-4">
        <Textarea
          placeholder={isHumanStep ? "Add any notes or comments before approval..." : "Add notes for this step..."}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] bg-secondary/50 border-border resize-none"
        />

        <div className="flex items-center justify-between">
          {isHumanStep ? (
            <div className="flex items-center gap-3">
              <Button onClick={onApprove} className="gap-2 bg-primary hover:bg-primary/90">
                <CheckCircle className="w-4 h-4" />
                Approve & Continue
              </Button>
              <Button variant="destructive" onClick={onReject} className="gap-2">
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          ) : (
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Submit Notes
            </Button>
          )}
          <Button variant="ghost" size="sm">
            Revert to Human Flow
          </Button>
        </div>
      </div>
    </div>
  )
}
