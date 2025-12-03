"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Upload, FileText, AlertCircle, Loader2, CheckCircle2, ArrowLeft, Eye } from "lucide-react"
import type { CsvClaim } from "@/app/page"

interface EobUploadScreenProps {
  claim: CsvClaim
  onEobUploaded: (claimId: string, eobUrl: string) => void
  onBack: () => void
}

type UploadState = "idle" | "uploading" | "success"

export function EobUploadScreen({ claim, onEobUploaded, onBack }: EobUploadScreenProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".pdf")) {
        setError("Please upload a PDF file")
        return
      }

      setFileName(file.name)
      setError(null)
      setUploadState("uploading")

      try {
        // Simulate upload
        await new Promise((r) => setTimeout(r, 1500))

        // Create a mock URL for the uploaded file
        const mockUrl = `https://example.com/eob/${claim.claimId}/${file.name}`
        setPreviewUrl(mockUrl)
        setUploadState("success")
      } catch (err) {
        setError("Failed to upload file. Please try again.")
        setUploadState("idle")
      }
    },
    [claim.claimId],
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

  const handleProceed = () => {
    if (previewUrl) {
      onEobUploaded(claim.claimId, previewUrl)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Claims Queue
        </Button>

        {/* Claim Info Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">EOB Upload Required</CardTitle>
            <CardDescription>
              Upload the Explanation of Benefits (EOB) document for this claim to proceed with the resolution workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Claim ID</p>
                <p className="font-mono text-foreground">{claim.claimId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="text-foreground">{claim.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payer</p>
                <p className="text-foreground">{claim.payer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-foreground">{formatCurrency(claim.billedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Upload EOB Document</CardTitle>
            <CardDescription>Upload the EOB PDF for claim {claim.claimId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadState !== "success" ? (
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
                      : "border-border hover:border-primary/50 hover:bg-secondary/30"
                  }
                `}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadState === "uploading"}
                />

                {uploadState === "idle" ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-1">Drag and drop your EOB PDF here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                    <p className="text-foreground font-medium mb-1">{fileName}</p>
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </>
                )}
              </div>
            ) : (
              <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-foreground font-medium mb-1">{fileName}</p>
                <p className="text-sm text-emerald-400 mb-4">Upload successful</p>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Eye className="w-4 h-4" />
                  Preview EOB
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button onClick={handleProceed} disabled={uploadState !== "success"} className="gap-2">
                Proceed to Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
