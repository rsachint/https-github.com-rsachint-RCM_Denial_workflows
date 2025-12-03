"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, User, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityLogProps {
  currentStep: number
}

const activities = [
  {
    id: 1,
    type: "ai",
    action: "EOB Retrieved",
    description: "Successfully extracted denial codes CO252, M127",
    time: "2 min ago",
    status: "success",
  },
  {
    id: 2,
    type: "ai",
    action: "Denial Analyzed",
    description: "Identified as documentation request",
    time: "2 min ago",
    status: "success",
  },
  {
    id: 3,
    type: "ai",
    action: "Resolution Generated",
    description: "4 steps recommended for claim resolution",
    time: "1 min ago",
    status: "success",
  },
  {
    id: 4,
    type: "system",
    action: "Awaiting Approval",
    description: "Human review required to proceed",
    time: "Just now",
    status: "pending",
  },
]

export function ActivityLog({ currentStep }: ActivityLogProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                activity.type === "ai" ? "bg-primary/20" : "bg-accent/20",
              )}
            >
              {activity.type === "ai" ? (
                <Bot className="w-3 h-3 text-primary" />
              ) : (
                <User className="w-3 h-3 text-accent" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{activity.action}</p>
                {activity.status === "success" ? (
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-warning" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
