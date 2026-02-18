import { ModeProvider } from './context/ModeProvider'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import TopBar from './components/TopBar'
import PatientPanel from './components/patient/PatientPanel'
import ReasoningPanel from './components/reasoning/ReasoningPanel'
import DiagramPanel from './components/diagram/DiagramPanel'
import ExpertOverlay from './components/overlay/ExpertOverlay'

function App() {
  return (
    <ModeProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar />
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Patient Panel */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <PatientPanel />
          </Panel>

          <PanelResizeHandle
            style={{
              width: '1px',
              background: 'var(--border)',
              cursor: 'col-resize',
            }}
          />

          {/* Reasoning Panel */}
          <Panel defaultSize={50} minSize={30}>
            <ReasoningPanel />
          </Panel>

          <PanelResizeHandle
            style={{
              width: '1px',
              background: 'var(--border)',
              cursor: 'col-resize',
            }}
          />

          {/* Diagram Panel */}
          <Panel defaultSize={30} minSize={20} maxSize={50}>
            <DiagramPanel />
          </Panel>
        </PanelGroup>
      </div>
      <ExpertOverlay />
    </ModeProvider>
  )
}

export default App
