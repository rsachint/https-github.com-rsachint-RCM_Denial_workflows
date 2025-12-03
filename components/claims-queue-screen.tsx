"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Upload,
  FileCheck,
  FileX,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { CsvClaim } from "@/app/page"

interface ClaimsQueueScreenProps {
  claims: CsvClaim[]
  claimsWithEob: CsvClaim[]
  claimsWithoutEob: CsvClaim[]
  onStartClaim: (claim: CsvClaim) => void
  onEobUploadNeeded: (claim: CsvClaim) => void
}

export function ClaimsQueueScreen({
  claims,
  claimsWithEob,
  claimsWithoutEob,
  onStartClaim,
  onEobUploadNeeded,
}: ClaimsQueueScreenProps) {
  const [expandedWithEob, setExpandedWithEob] = useState(true)
  const [expandedWithoutEob, setExpandedWithoutEob] = useState(true)

  // CO252 claims stats
  const co252Claims = claims.filter((c) => c.denialCode === "CO252")
  const totalCo252 = co252Claims.length
  const withEobCount = claimsWithEob.length
  const withoutEobCount = claimsWithoutEob.length
  const completedWithEob = claimsWithEob.filter((c) => c.status === "completed").length
  const completedWithoutEob = claimsWithoutEob.filter((c) => c.status === "completed").length

  // Find next claim to process (with EOB first, then without)
  const nextClaimWithEob = claimsWithEob.find((c) => c.status === "pending")
  const nextClaimWithoutEob = claimsWithoutEob.find((c) => c.status === "pending")
  const allWithEobDone = !nextClaimWithEob

  const getStatusBadge = (status: CsvClaim["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claims Queue</h1>
          <p className="text-muted-foreground mt-1">Review and process CO252 denied claims for resolution</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalCo252}</p>
                  <p className="text-sm text-muted-foreground">Total CO252 Claims</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{withEobCount}</p>
                  <p className="text-sm text-muted-foreground">With EOB Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <FileX className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{withoutEobCount}</p>
                  <p className="text-sm text-muted-foreground">Without EOB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedWithEob + completedWithoutEob}</p>
                  <p className="text-sm text-muted-foreground">Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claims with EOB */}
        <Card className="bg-card border-border">
          <CardHeader className="cursor-pointer" onClick={() => setExpandedWithEob(!expandedWithEob)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Claims with EOB Available</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {completedWithEob} of {withEobCount} processed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {nextClaimWithEob && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onStartClaim(nextClaimWithEob)
                    }}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Next Claim
                  </Button>
                )}
                {expandedWithEob ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
          {expandedWithEob && (
            <CardContent>
              <div className="space-y-2">
                {claimsWithEob.map((claim, idx) => (
                  <div
                    key={claim.claimId}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-foreground">{claim.claimId}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-foreground">{claim.patientName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {claim.payer} • {claim.dos} • {formatCurrency(claim.billedAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(claim.status)}
                      {claim.status === "pending" && claim.claimId === nextClaimWithEob?.claimId && (
                        <Button size="sm" variant="outline" onClick={() => onStartClaim(claim)} className="gap-1">
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Claims without EOB */}
        <Card className="bg-card border-border">
          <CardHeader className="cursor-pointer" onClick={() => setExpandedWithoutEob(!expandedWithoutEob)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <FileX className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Claims without EOB</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {completedWithoutEob} of {withoutEobCount} processed • EOB upload required
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {allWithEobDone && nextClaimWithoutEob && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEobUploadNeeded(nextClaimWithoutEob)
                    }}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload EOB for Next Claim
                  </Button>
                )}
                {!allWithEobDone && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Process EOB claims first
                  </Badge>
                )}
                {expandedWithoutEob ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
          {expandedWithoutEob && (
            <CardContent>
              <div className="space-y-2">
                {claimsWithoutEob.map((claim, idx) => (
                  <div
                    key={claim.claimId}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      allWithEobDone ? "bg-secondary/30 hover:bg-secondary/50" : "bg-secondary/20 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-foreground">{claim.claimId}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-foreground">{claim.patientName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {claim.payer} • {claim.dos} • {formatCurrency(claim.billedAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(claim.status)}
                      {allWithEobDone &&
                        claim.status === "pending" &&
                        claim.claimId === nextClaimWithoutEob?.claimId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEobUploadNeeded(claim)}
                            className="gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Upload EOB
                          </Button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
