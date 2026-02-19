import { ModeProvider } from './context/ModeProvider'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import TopBar from './components/TopBar'
import PatientPanel from './components/patient/PatientPanel'
import ReasoningPanel from './components/reasoning/ReasoningPanel'
import DiagramPanel from './components/diagram/DiagramPanel'
import ExpertOverlay from './components/overlay/ExpertOverlay'
import FeedbackModal from './components/overlay/FeedbackModal'
import { PatientFullscreen } from './components/patient/PatientFullscreen'
import { DiagramFullscreen } from './components/diagram/DiagramFullscreen'

function App() {
  return (
    <ModeProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <TopBar />
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Patient Panel */}
          <Panel defaultSize={20} minSize={5}>
            <PatientPanel />
          </Panel>

          <PanelResizeHandle className="group relative w-2 cursor-col-resize bg-[var(--border)] transition-colors duration-200 hover:bg-[var(--teal)]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[var(--border-md)]" />
          </PanelResizeHandle>

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
        </PanelGroup>
      </div>
      <ExpertOverlay />
      <FeedbackModal />
      <PatientFullscreen />
      <DiagramFullscreen />
    </ModeProvider>
  )
}

export default App
