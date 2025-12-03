"use client"

import { useEffect } from "react"
import { WorkflowHeader } from "@/components/workflow-header"
import { WorkflowProgress } from "@/components/workflow-progress"
import { NbaAgentPanel } from "@/components/nba-agent-panel"
import { ActionAgentPanel } from "@/components/action-agent-panel"
import { DocumentReviewPanel } from "@/components/document-review-panel"
import { SmartsheetEmbed } from "@/components/smartsheet-embed"
import { MergedPdfPreview } from "@/components/merged-pdf-preview"
import { CaseNotesPanel } from "@/components/case-notes-panel"
import { CompletedPanel } from "@/components/completed-panel"
import { ManualFlowPanel } from "@/components/manual-flow-panel"
import { AgentLogsPanel } from "@/components/agent-logs-panel"
import { ClaimSummary } from "@/components/claim-summary"
import type { WorkflowState, AgentLog, DocumentItem } from "@/app/page"

interface WorkflowDashboardProps {
  state: WorkflowState
  updateState: (updates: Partial<WorkflowState>) => void
  addLog: (message: string, status?: AgentLog["status"]) => void
  updateLastLog: (status: AgentLog["status"]) => void
  onNextClaim: () => void
  onBackToQueue: () => void
  totalClaims?: number
  currentClaimNumber?: number
}

export function WorkflowDashboard({
  state,
  updateState,
  addLog,
  updateLastLog,
  onNextClaim,
  onBackToQueue,
  totalClaims,
  currentClaimNumber,
}: WorkflowDashboardProps) {
  // Simulate claim analysis processing
  useEffect(() => {
    if (state.phase === "nba-processing") {
      const runAnalysis = async () => {
        addLog("Retrieving claim information from database...")
        await new Promise((r) => setTimeout(r, 1200))
        updateLastLog("success")

        addLog("Identifying denial codes...")
        await new Promise((r) => setTimeout(r, 1000))
        updateLastLog("success")

        addLog(`Found CARC: ${state.claimData?.carcCode}, RARC: ${state.claimData?.rarcCode}`)
        await new Promise((r) => setTimeout(r, 800))
        updateLastLog("success")

        addLog("Analyzing denial reason...")
        await new Promise((r) => setTimeout(r, 1500))
        updateLastLog("success")

        addLog("Retrieving recommended resolution steps...")
        await new Promise((r) => setTimeout(r, 1500))
        updateLastLog("success")

        addLog("Analysis complete. Summary ready for review.")
        updateLastLog("success")

        updateState({ phase: "nba-approval" })
      }
      runAnalysis()
    }
  }, [state.phase])

  // Simulate document retrieval
  useEffect(() => {
    if (state.phase === "action-retrieving-docs") {
      const runDocRetrieval = async () => {
        addLog("Navigating to Documents tab in PMS portal...")
        await new Promise((r) => setTimeout(r, 1000))
        updateLastLog("success")

        addLog("Accessing Chart Notes section...")
        await new Promise((r) => setTimeout(r, 1200))
        updateLastLog("success")

        addLog("Accessing Delivery Ticket section...")
        await new Promise((r) => setTimeout(r, 1000))
        updateLastLog("success")

        addLog("Searching for documents relevant to claim denial...")
        await new Promise((r) => setTimeout(r, 1500))
        updateLastLog("success")

        addLog("Found 8 documents. Ready for review.")
        updateLastLog("success")

        // Mock documents based on the Brightree screenshot
        const documents: DocumentItem[] = [
          {
            id: "1",
            name: "C. NOTES - E0676",
            category: "Chart Notes",
            date: "10/23/2025 9:48 AM",
            code: "E0676",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "2",
            name: "CHART NOTES - L1852",
            category: "Chart Notes",
            date: "07/21/2023 2:44 PM",
            code: "L1852",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "3",
            name: "Chart Notes",
            category: "Chart Notes",
            date: "02/23/2022 3:00 PM",
            code: "L1852",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "4",
            name: "DT - E0676",
            category: "Delivery Ticket",
            date: "10/23/2025 9:48 AM",
            code: "E0676",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "5",
            name: "Delivery Ticket",
            category: "Delivery Ticket",
            date: "12/05/2023 2:03 PM",
            code: "E0676",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "6",
            name: "Delivery Ticket",
            category: "Delivery Ticket",
            date: "08/16/2023 9:54 AM",
            code: "E0673",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "7",
            name: "POD",
            category: "Delivery Ticket",
            date: "08/01/2023 7:56 AM",
            code: "POD",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
          {
            id: "8",
            name: "L1852 X 1 L2397 X 2",
            category: "Delivery Ticket",
            date: "03/21/2022 10:47 AM",
            code: "L1852",
            provider: "Voyage Medical Solutions LLC",
            selected: false,
          },
        ]

        updateState({ phase: "doc-review", documents })
      }
      runDocRetrieval()
    }
  }, [state.phase])

  // Simulate merging PDFs
  useEffect(() => {
    if (state.phase === "action-merging") {
      const runMerge = async () => {
        addLog("Downloading selected documents...")
        await new Promise((r) => setTimeout(r, 1500))
        updateLastLog("success")

        addLog(`Merging ${state.selectedDocuments.length} documents into single PDF...`)
        await new Promise((r) => setTimeout(r, 2000))
        updateLastLog("success")

        addLog("Merged PDF created successfully.")
        updateLastLog("success")

        updateState({
          phase: "merge-review",
          mergedPdfUrl: "/merged-medical-documents-pdf-preview.jpg",
        })
      }
      runMerge()
    }
  }, [state.phase])

  // Simulate submitting to payer
  useEffect(() => {
    if (state.phase === "action-submitting") {
      const runSubmission = async () => {
        addLog("Connecting to payer portal...")
        await new Promise((r) => setTimeout(r, 1000))
        updateLastLog("success")

        addLog("Uploading merged documentation...")
        await new Promise((r) => setTimeout(r, 2000))

        // Simulate potential failure for retry logic
        const shouldFail = state.retryCount === 0 && Math.random() < 0.3

        if (shouldFail) {
          updateLastLog("error")
          addLog("Submission failed. Retrying...")
          updateState({ retryCount: state.retryCount + 1 })
          await new Promise((r) => setTimeout(r, 1500))
          addLog("Retry attempt: Uploading merged documentation...")
          await new Promise((r) => setTimeout(r, 2000))

          // Check if second attempt also fails
          const shouldFailAgain = Math.random() < 0.2
          if (shouldFailAgain) {
            updateLastLog("error")
            addLog("Second retry failed. Reverting to manual flow.")
            updateState({ phase: "manual-flow" })
            return
          }
        }

        updateLastLog("success")
        addLog("Documentation submitted successfully to payer portal.")
        updateLastLog("success")

        addLog("Taking Case ID snapshot as proof of submission...")
        await new Promise((r) => setTimeout(r, 1000))
        updateLastLog("success")

        addLog("Navigating to PMS portal...")
        await new Promise((r) => setTimeout(r, 800))
        updateLastLog("success")

        addLog("Uploading merged PDF and Case ID snapshot to Documents tab under Appeals category...")
        await new Promise((r) => setTimeout(r, 1500))
        updateLastLog("success")

        addLog("Generating summary and case notes for review...")
        await new Promise((r) => setTimeout(r, 1200))
        updateLastLog("success")

        updateState({ phase: "case-notes" })
      }
      runSubmission()
    }
  }, [state.phase])

  const handleApproveResolution = () => {
    addLog("Reviewed and approved recommended resolution steps.", "success")
    updateState({ phase: "action-retrieving-docs" })
  }

  const handleRejectResolution = () => {
    addLog("Rejected recommended resolution steps. Reverting to manual flow.", "success")
    updateState({ phase: "manual-flow" })
  }

  const handleDocumentSelect = (docId: string) => {
    const newSelected = state.selectedDocuments.includes(docId)
      ? state.selectedDocuments.filter((id) => id !== docId)
      : [...state.selectedDocuments, docId]
    updateState({ selectedDocuments: newSelected })
  }

  const handleDocumentsConfirmed = () => {
    if (state.selectedDocuments.length > 0) {
      addLog(`Reviewed and confirmed ${state.selectedDocuments.length} documents as relevant.`, "success")
      updateState({ phase: "action-merging" })
    }
  }

  const handleDocumentsNotRelevant = () => {
    addLog("Marked retrieved documents as not relevant. Opening Smartsheets for client communication.", "success")
    updateState({ phase: "smartsheets" })
  }

  const handleMergeApproved = () => {
    addLog("Reviewed and approved merged PDF for submission to payer portal.", "success")
    updateState({ phase: "action-submitting" })
  }

  const handleMergeRejected = () => {
    addLog("Rejected merged PDF. Returning to document selection.", "success")
    updateState({ phase: "doc-review", selectedDocuments: [] })
  }

  const handleCaseNotesSubmit = (notes: string) => {
    addLog("Reviewed and submitted final case notes to PMS portal.", "success")
    updateState({ caseNotes: notes, phase: "completed" })
  }

  const renderMainContent = () => {
    switch (state.phase) {
      case "nba-processing":
        return (
          <NbaAgentPanel claimData={state.claimData} isProcessing={true} onApprove={() => {}} onReject={() => {}} />
        )
      case "nba-approval":
        return (
          <NbaAgentPanel
            claimData={state.claimData}
            isProcessing={false}
            onApprove={handleApproveResolution}
            onReject={handleRejectResolution}
          />
        )
      case "action-retrieving-docs":
        return <ActionAgentPanel status="retrieving" claimData={state.claimData} />
      case "doc-review":
        return (
          <DocumentReviewPanel
            documents={state.documents}
            selectedDocuments={state.selectedDocuments}
            onDocumentSelect={handleDocumentSelect}
            onConfirm={handleDocumentsConfirmed}
            onNotRelevant={handleDocumentsNotRelevant}
            claimData={state.claimData}
          />
        )
      case "smartsheets":
        return <SmartsheetEmbed onBack={() => updateState({ phase: "doc-review" })} claimData={state.claimData} />
      case "action-merging":
        return <ActionAgentPanel status="merging" claimData={state.claimData} />
      case "merge-review":
        return (
          <MergedPdfPreview
            pdfUrl={state.mergedPdfUrl}
            documentCount={state.selectedDocuments.length}
            onApprove={handleMergeApproved}
            onReject={handleMergeRejected}
            claimData={state.claimData}
          />
        )
      case "action-submitting":
        return <ActionAgentPanel status="submitting" retryCount={state.retryCount} claimData={state.claimData} />
      case "case-notes":
        return (
          <CaseNotesPanel
            claimData={state.claimData}
            onSubmit={handleCaseNotesSubmit}
            selectedDocuments={state.selectedDocuments}
            documents={state.documents}
          />
        )
      case "completed":
        return <CompletedPanel claimData={state.claimData} onNextClaim={onNextClaim} agentLogs={state.agentLogs} />
      case "manual-flow":
        return <ManualFlowPanel claimData={state.claimData} onBackToQueue={onBackToQueue} />
      default:
        return null
    }
  }

  return (
    <>
      <WorkflowHeader
        claimData={state.claimData}
        phase={state.phase}
        onBackToQueue={onBackToQueue}
        totalClaims={totalClaims}
        currentClaimNumber={currentClaimNumber}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Workflow Progress */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <WorkflowProgress phase={state.phase} />
            <ClaimSummary claimData={state.claimData} />
          </div>

          {/* Center Column - Main Content */}
          <div className="col-span-12 lg:col-span-6 space-y-6">{renderMainContent()}</div>

          {/* Right Column - Activity Logs */}
          <div className="col-span-12 lg:col-span-3">
            <AgentLogsPanel logs={state.agentLogs} />
          </div>
        </div>
      </div>
    </>
  )
}
