import { ModeProvider, useMode } from './context/ModeProvider'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import TopBar from './components/TopBar'
import PatientPanel from './components/patient/PatientPanel'
import ReasoningPanel from './components/reasoning/ReasoningPanel'
import DiagramPanel from './components/diagram/DiagramPanel'
import FeedbackView from './components/overlay/FeedbackView'
import { PatientFullscreen } from './components/patient/PatientFullscreen'
import { DiagramFullscreen } from './components/diagram/DiagramFullscreen'
import BlockDetailModal from './components/diagram/BlockDetailModal'
import ModeSelectionModal from './components/ModeSelectionModal'
import DifficultyModal from './components/DifficultyModal'

function App() {
  return (
    <ModeProvider>
      <AppContent />
    </ModeProvider>
  )
}

function AppContent() {
  const { showFeedbackModal } = useMode()

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <TopBar />
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Patient Panel - always visible */}
          <Panel defaultSize={20} minSize={5}>
            <PatientPanel />
          </Panel>

          <PanelResizeHandle className="group relative w-2 cursor-col-resize bg-[var(--border)] transition-colors duration-200 hover:bg-[var(--teal)]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[var(--border-md)]" />
          </PanelResizeHandle>

          {/* Conditional: Show Feedback View OR Reasoning + Diagram panels */}
          {showFeedbackModal ? (
            <Panel defaultSize={80} minSize={50}>
              <FeedbackView />
            </Panel>
          ) : (
            <>
              {/* Reasoning Panel */}
              <Panel defaultSize={50} minSize={10}>
                <ReasoningPanel />
              </Panel>

              <PanelResizeHandle className="group relative w-2 cursor-col-resize bg-[var(--border)] transition-colors duration-200 hover:bg-[var(--teal)]">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[var(--border-md)]" />
              </PanelResizeHandle>

              {/* Diagram Panel */}
              <Panel defaultSize={30} minSize={5}>
                <DiagramPanel />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
      <ModeSelectionModal />
      <DifficultyModal />
      <BlockDetailModal />
      <PatientFullscreen />
      <DiagramFullscreen />
    </>
  )
}

export default App
