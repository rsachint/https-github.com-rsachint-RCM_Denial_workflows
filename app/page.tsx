"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { LoginScreen } from "@/components/login-screen"
import { CsvUploadScreen } from "@/components/csv-upload-screen"
import { ClaimsQueueScreen } from "@/components/claims-queue-screen"
import { EobUploadScreen } from "@/components/eob-upload-screen"
import { WorkflowDashboard } from "@/components/workflow-dashboard"

export type AppPhase = "login" | "csv-upload" | "claims-queue" | "eob-upload" | "workflow"

export type WorkflowPhase =
  | "nba-processing"
  | "nba-approval"
  | "action-retrieving-docs"
  | "doc-review"
  | "smartsheets"
  | "action-merging"
  | "merge-review"
  | "action-submitting"
  | "case-notes"
  | "completed"
  | "manual-flow"

export type AgentLog = {
  id: string
  agent: "system"
  message: string
  status: "running" | "success" | "error"
}

export type ClaimData = {
  claimId: string
  patientName: string
  dos: string
  provider: string
  payer: string
  carcCode: string
  rarcCode: string
  denialReason: string
  resolutionSteps: string[]
  billedAmount: number
  eobUrl?: string
}

export type CsvClaim = {
  claimId: string
  patientName: string
  dos: string
  provider: string
  payer: string
  denialCode: string
  denialReason: string
  billedAmount: number
  eobUrl: string | null
  status: "pending" | "in-progress" | "completed" | "failed"
}

export type DocumentItem = {
  id: string
  name: string
  category: string
  date: string
  code: string
  provider: string
  selected: boolean
}

export type WorkflowState = {
  phase: WorkflowPhase
  claimData: ClaimData | null
  agentLogs: AgentLog[]
  documents: DocumentItem[]
  selectedDocuments: string[]
  mergedPdfUrl: string | null
  caseNotes: string
  retryCount: number
}

export type AppState = {
  appPhase: AppPhase
  user: { username: string } | null
  csvClaims: CsvClaim[]
  currentClaimIndex: number
  claimsWithEob: CsvClaim[]
  claimsWithoutEob: CsvClaim[]
  processingEobClaims: boolean
  workflowState: WorkflowState
}

const STORAGE_KEY = "rcm-app-state"

const initialWorkflowState: WorkflowState = {
  phase: "nba-processing",
  claimData: null,
  agentLogs: [],
  documents: [],
  selectedDocuments: [],
  mergedPdfUrl: null,
  caseNotes: "",
  retryCount: 0,
}

const initialAppState: AppState = {
  appPhase: "login",
  user: null,
  csvClaims: [],
  currentClaimIndex: 0,
  claimsWithEob: [],
  claimsWithoutEob: [],
  processingEobClaims: false,
  workflowState: initialWorkflowState,
}

export default function ClaimResolutionPage() {
  const [appState, setAppState] = useState<AppState>(initialAppState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAppState(parsed)
      } catch {
        // If parsing fails, use initial state
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && appState.appPhase !== "login") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
    }
  }, [appState, isHydrated])

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...updates }))
  }

  const updateWorkflowState = (updates: Partial<WorkflowState>) => {
    setAppState((prev) => ({
      ...prev,
      workflowState: { ...prev.workflowState, ...updates },
    }))
  }

  const addLog = (message: string, status: AgentLog["status"] = "running") => {
    const newLog: AgentLog = {
      id: Date.now().toString(),
      agent: "system",
      message,
      status,
    }
    setAppState((prev) => ({
      ...prev,
      workflowState: {
        ...prev.workflowState,
        agentLogs: [...prev.workflowState.agentLogs, newLog],
      },
    }))
  }

  const updateLastLog = (status: AgentLog["status"]) => {
    setAppState((prev) => ({
      ...prev,
      workflowState: {
        ...prev.workflowState,
        agentLogs: prev.workflowState.agentLogs.map((log, i) =>
          i === prev.workflowState.agentLogs.length - 1 ? { ...log, status } : log,
        ),
      },
    }))
  }

  const handleLogin = (username: string) => {
    updateAppState({ user: { username }, appPhase: "csv-upload" })
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAppState(initialAppState)
  }

  const handleCsvUploaded = (claims: CsvClaim[]) => {
    const co252Claims = claims.filter((c) => c.denialCode === "CO252")
    const withEob = co252Claims.filter((c) => c.eobUrl !== null)
    const withoutEob = co252Claims.filter((c) => c.eobUrl === null)

    updateAppState({
      csvClaims: claims,
      claimsWithEob: withEob,
      claimsWithoutEob: withoutEob,
      appPhase: "claims-queue",
    })
  }

  const handleStartClaim = (claim: CsvClaim) => {
    const claimData: ClaimData = {
      claimId: claim.claimId,
      patientName: claim.patientName,
      dos: claim.dos,
      provider: claim.provider,
      payer: claim.payer,
      carcCode: claim.denialCode.replace("CO", ""),
      rarcCode: "M127",
      denialReason: claim.denialReason,
      resolutionSteps: [
        "Pull relevant MR (Medical Record) documents from PMS portal",
        "Verify documents for relevance, completeness and correctness",
        "Merge the verified documents into a single PDF",
        "Upload merged documents to payer portal",
        "Take Case ID snapshot (proof of documents uploaded) from payer portal",
        "Submit merged documents, Case ID snapshot and notes to PMS portal under 'Appeals' category in document tab",
      ],
      billedAmount: claim.billedAmount,
      eobUrl: claim.eobUrl || undefined,
    }

    updateAppState({
      appPhase: "workflow",
      workflowState: {
        ...initialWorkflowState,
        claimData,
      },
    })
  }

  const handleEobUpload = (claimId: string, eobUrl: string) => {
    const updatedWithoutEob = appState.claimsWithoutEob.map((c) => (c.claimId === claimId ? { ...c, eobUrl } : c))
    const claimToStart = updatedWithoutEob.find((c) => c.claimId === claimId)

    if (claimToStart) {
      const claimData: ClaimData = {
        claimId: claimToStart.claimId,
        patientName: claimToStart.patientName,
        dos: claimToStart.dos,
        provider: claimToStart.provider,
        payer: claimToStart.payer,
        carcCode: claimToStart.denialCode.replace("CO", ""),
        rarcCode: "M127",
        denialReason: claimToStart.denialReason,
        resolutionSteps: [
          "Pull relevant MR (Medical Record) documents from PMS portal",
          "Verify documents for relevance, completeness and correctness",
          "Merge the verified documents into a single PDF",
          "Upload merged documents to payer portal",
          "Take Case ID snapshot (proof of documents uploaded) from payer portal",
          "Submit merged documents, Case ID snapshot and notes to PMS portal under 'Appeals' category in document tab",
        ],
        billedAmount: claimToStart.billedAmount,
        eobUrl: eobUrl,
      }

      updateAppState({
        claimsWithoutEob: updatedWithoutEob,
        appPhase: "workflow",
        workflowState: {
          ...initialWorkflowState,
          claimData,
        },
      })
    }
  }

  const handleClaimCompleted = (status: "completed" | "failed") => {
    const currentClaim = appState.workflowState.claimData
    if (currentClaim) {
      const updateClaimStatus = (claims: CsvClaim[]) =>
        claims.map((c) => (c.claimId === currentClaim.claimId ? { ...c, status } : c))

      updateAppState({
        claimsWithEob: updateClaimStatus(appState.claimsWithEob),
        claimsWithoutEob: updateClaimStatus(appState.claimsWithoutEob),
        csvClaims: updateClaimStatus(appState.csvClaims),
      })
    }
  }

  const handleNextClaim = () => {
    handleClaimCompleted("completed")
    updateAppState({ appPhase: "claims-queue" })
  }

  const handleBackToQueue = () => {
    updateAppState({ appPhase: "claims-queue" })
  }

  if (!isHydrated) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (appState.appPhase === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={appState.user} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {appState.appPhase === "csv-upload" && <CsvUploadScreen onCsvUploaded={handleCsvUploaded} />}
        {appState.appPhase === "claims-queue" && (
          <ClaimsQueueScreen
            claims={appState.csvClaims}
            claimsWithEob={appState.claimsWithEob}
            claimsWithoutEob={appState.claimsWithoutEob}
            onStartClaim={handleStartClaim}
            onEobUploadNeeded={(claim) => {
              updateAppState({
                appPhase: "eob-upload",
                currentClaimIndex: appState.claimsWithoutEob.findIndex((c) => c.claimId === claim.claimId),
              })
            }}
          />
        )}
        {appState.appPhase === "eob-upload" && (
          <EobUploadScreen
            claim={appState.claimsWithoutEob[appState.currentClaimIndex]}
            onEobUploaded={handleEobUpload}
            onBack={handleBackToQueue}
          />
        )}
        {appState.appPhase === "workflow" && (
          <WorkflowDashboard
            state={appState.workflowState}
            updateState={updateWorkflowState}
            addLog={addLog}
            updateLastLog={updateLastLog}
            onNextClaim={handleNextClaim}
            onBackToQueue={handleBackToQueue}
            totalClaims={appState.claimsWithEob.length + appState.claimsWithoutEob.length}
            currentClaimNumber={
              appState.csvClaims
                .filter((c) => c.denialCode === "CO252")
                .findIndex((c) => c.claimId === appState.workflowState.claimData?.claimId) + 1
            }
          />
        )}
      </main>
    </div>
  )
}
