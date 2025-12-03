import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, Calendar, DollarSign } from "lucide-react"
import type { ClaimData } from "@/app/page"

interface ClaimSummaryProps {
  claimData: ClaimData | null
}

export function ClaimSummary({ claimData }: ClaimSummaryProps) {
  if (!claimData) return null

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Claim Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Patient</p>
            <p className="text-sm font-medium text-foreground truncate">{claimData.patientName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Provider</p>
            <p className="text-sm font-medium text-foreground truncate">{claimData.provider}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Date of Service</p>
            <p className="text-sm font-medium text-foreground">{claimData.dos}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Billed Amount</p>
            <p className="text-sm font-medium text-foreground">${claimData.billedAmount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
