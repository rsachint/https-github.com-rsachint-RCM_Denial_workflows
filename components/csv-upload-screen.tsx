"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Upload, FileSpreadsheet, AlertCircle, Loader2, CheckCircle2, FileWarning } from "lucide-react"
import type { CsvClaim } from "@/app/page"

interface CsvUploadScreenProps {
  onCsvUploaded: (claims: CsvClaim[]) => void
}

type UploadState = "idle" | "uploading" | "parsing" | "error"

export function CsvUploadScreen({ onCsvUploaded }: CsvUploadScreenProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const parseCsv = (content: string): CsvClaim[] => {
    const lines = content.trim().split("\n")
    if (lines.length < 2) {
      throw new Error("CSV file must have a header row and at least one data row")
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    // Check required columns
    const requiredColumns = ["claim id", "denial code", "denial reason", "eob availability"]
    for (const col of requiredColumns) {
      if (!headers.some((h) => h.includes(col.split(" ")[0]))) {
        throw new Error(`Missing required column: ${col}`)
      }
    }

    const claims: CsvClaim[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length < headers.length) continue

      const claimIdIdx = headers.findIndex((h) => h.includes("claim"))
      const patientIdx = headers.findIndex((h) => h.includes("patient"))
      const dosIdx = headers.findIndex((h) => h.includes("dos") || h.includes("date"))
      const providerIdx = headers.findIndex((h) => h.includes("provider"))
      const payerIdx = headers.findIndex((h) => h.includes("payer"))
      const denialCodeIdx = headers.findIndex((h) => h.includes("denial") && h.includes("code"))
      const denialReasonIdx = headers.findIndex((h) => h.includes("denial") && h.includes("reason"))
      const amountIdx = headers.findIndex((h) => h.includes("amount") || h.includes("billed"))
      const eobIdx = headers.findIndex((h) => h.includes("eob"))

      claims.push({
        claimId: values[claimIdIdx] || `CLM-${i}`,
        patientName: values[patientIdx] || "Unknown Patient",
        dos: values[dosIdx] || new Date().toISOString().split("T")[0],
        provider: values[providerIdx] || "Unknown Provider",
        payer: values[payerIdx] || "Unknown Payer",
        denialCode: values[denialCodeIdx] || "CO252",
        denialReason: values[denialReasonIdx] || "Additional documentation required",
        billedAmount: Number.parseFloat(values[amountIdx]?.replace(/[$,]/g, "") || "0"),
        eobUrl:
          values[eobIdx] && values[eobIdx] !== "" && values[eobIdx].toLowerCase() !== "n/a" ? values[eobIdx] : null,
        status: "pending",
      })
    }

    return claims
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file")
        return
      }

      setFileName(file.name)
      setError(null)
      setUploadState("uploading")

      try {
        await new Promise((r) => setTimeout(r, 800))
        setUploadState("parsing")

        const content = await file.text()
        await new Promise((r) => setTimeout(r, 600))

        const claims = parseCsv(content)

        if (claims.length === 0) {
          throw new Error("No valid claims found in the CSV file")
        }

        onCsvUploaded(claims)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV file")
        setUploadState("error")
      }
    },
    [onCsvUploaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleUseSampleData = () => {
    // Generate sample claims for demo
    const sampleClaims: CsvClaim[] = [
      {
        claimId: "440553",
        patientName: "Joel Ross",
        dos: "2024-10-23",
        provider: "Voyage Medical Solutions LLC",
        payer: "Blue Cross Blue Shield",
        denialCode: "CO252",
        denialReason: "Additional documentation/information is needed to process this claim.",
        billedAmount: 2000,
        eobUrl: "https://example.com/eob/440553.pdf",
        status: "pending",
      },
      {
        claimId: "440554",
        patientName: "Sarah Mitchell",
        dos: "2024-10-15",
        provider: "Voyage Medical Solutions LLC",
        payer: "Aetna",
        denialCode: "CO252",
        denialReason: "Additional documentation/information is needed to process this claim.",
        billedAmount: 3500,
        eobUrl: "https://example.com/eob/440554.pdf",
        status: "pending",
      },
      {
        claimId: "440555",
        patientName: "Michael Chen",
        dos: "2024-10-20",
        provider: "Voyage Medical Solutions LLC",
        payer: "United Healthcare",
        denialCode: "CO252",
        denialReason: "Additional documentation/information is needed to process this claim.",
        billedAmount: 1250,
        eobUrl: null, // No EOB
        status: "pending",
      },
      {
        claimId: "440556",
        patientName: "Emily Johnson",
        dos: "2024-10-18",
        provider: "Voyage Medical Solutions LLC",
        payer: "Cigna",
        denialCode: "CO252",
        denialReason: "Additional documentation/information is needed to process this claim.",
        billedAmount: 4200,
        eobUrl: null, // No EOB
        status: "pending",
      },
      {
        claimId: "440557",
        patientName: "David Williams",
        dos: "2024-10-12",
        provider: "Voyage Medical Solutions LLC",
        payer: "Humana",
        denialCode: "CO16",
        denialReason: "Claim/service lacks information or has submission/billing error(s).",
        billedAmount: 1800,
        eobUrl: "https://example.com/eob/440557.pdf",
        status: "pending",
      },
    ]

    onCsvUploaded(sampleClaims)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Upload Claims CSV</CardTitle>
          <CardDescription className="text-muted-foreground">
            Upload a CSV file containing claim information for batch processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${
                dragOver
                  ? "border-primary bg-primary/10"
                  : uploadState === "error"
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }
            `}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadState === "uploading" || uploadState === "parsing"}
            />

            {uploadState === "idle" || uploadState === "error" ? (
              <>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    uploadState === "error" ? "bg-destructive/20" : "bg-secondary"
                  }`}
                >
                  {uploadState === "error" ? (
                    <FileWarning className="w-6 h-6 text-destructive" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <p className="text-foreground font-medium mb-1">
                  {uploadState === "error" ? "Upload failed" : "Drag and drop your CSV file here"}
                </p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  {uploadState === "parsing" ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  )}
                </div>
                <p className="text-foreground font-medium mb-1">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {uploadState === "uploading" ? "Uploading..." : "Parsing claims data..."}
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-secondary/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Required CSV Columns:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <span className="text-foreground">Claim ID</span> - Unique identifier for the claim
              </li>
              <li>
                • <span className="text-foreground">Denial Code</span> - The denial reason code (e.g., CO252)
              </li>
              <li>
                • <span className="text-foreground">Denial Reason</span> - Description of the denial
              </li>
              <li>
                • <span className="text-foreground">EOB Availability</span> - URL of EOB PDF or empty if not available
              </li>
              <li>
                • <span className="text-muted-foreground">Patient Name, DOS, Provider, Payer, Amount (optional)</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="outline"
            onClick={handleUseSampleData}
            className="w-full h-11 bg-transparent"
            disabled={uploadState === "uploading" || uploadState === "parsing"}
          >
            Use Sample Data for Demo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
