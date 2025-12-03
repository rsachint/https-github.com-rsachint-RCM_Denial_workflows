import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Building2, Stethoscope } from "lucide-react"
import type { ClaimData } from "@/app/page"

interface ClaimDetailsProps {
  claim: ClaimData
}

export function ClaimDetails({ claim }: ClaimDetailsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Claim Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="text-sm font-medium text-foreground truncate">{claim.patientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Stethoscope className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Provider</p>
              <p className="text-sm font-medium text-foreground truncate">{claim.provider}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Payer</p>
              <p className="text-sm font-medium text-foreground truncate">{claim.payer}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Date of Service</p>
              <p className="text-sm font-medium text-foreground">{claim.dos}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Billed Amount</span>
            <span className="text-sm font-medium text-foreground">${claim.billedAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Allowed Amount</span>
            <span className="text-sm font-medium text-destructive">${claim.allowedAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-medium text-muted-foreground">Outstanding</span>
            <span className="text-sm font-bold text-foreground">${claim.billedAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
