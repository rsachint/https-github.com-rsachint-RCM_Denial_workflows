"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle2, Loader2, AlertCircle, Activity, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { AgentLog } from "@/app/page"

interface AgentLogsPanelProps {
  logs: AgentLog[]
}

export function AgentLogsPanel({ logs }: AgentLogsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, isExpanded])

  const runningCount = logs.filter((l) => l.status === "running").length
  const successCount = logs.filter((l) => l.status === "success").length
  const errorCount = logs.filter((l) => l.status === "error").length

  const renderLogItem = (log: AgentLog) => (
    <div key={log.id} className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-secondary">
        {log.status === "running" && <Loader2 className="w-3 h-3 text-accent animate-spin" />}
        {log.status === "success" && <CheckCircle2 className="w-3 h-3 text-primary" />}
        {log.status === "error" && <AlertCircle className="w-3 h-3 text-destructive" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{log.message}</p>
      </div>
    </div>
  )

  return (
    <Card className="bg-card border-border">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Log
                {logs.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    ({successCount} completed{errorCount > 0 ? `, ${errorCount} errors` : ""}
                    {runningCount > 0 ? `, ${runningCount} running` : ""})
                  </span>
                )}
              </CardTitle>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div ref={scrollRef} className="space-y-2 max-h-[500px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Waiting for activity...</p>
              ) : (
                logs.map(renderLogItem)
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
