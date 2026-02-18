import { ModeProvider } from './context/ModeProvider'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
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
          <Panel defaultSize={20} minSize={5}>
            <PatientPanel />
          </Panel>

          <PanelResizeHandle
            style={{
              width: '3px',
              background: 'var(--border-md)',
              cursor: 'col-resize',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = 'var(--teal)'
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = 'var(--border-md)'
            }}
          />

          {/* Reasoning Panel */}
          <Panel defaultSize={50} minSize={10}>
            <ReasoningPanel />
          </Panel>

          <PanelResizeHandle
            style={{
              width: '3px',
              background: 'var(--border-md)',
              cursor: 'col-resize',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = 'var(--teal)'
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = 'var(--border-md)'
            }}
          />

          {/* Diagram Panel */}
          <Panel defaultSize={30} minSize={5}>
            <DiagramPanel />
          </Panel>
        </PanelGroup>
      </div>
      <ExpertOverlay />
    </ModeProvider>
  )
}

export default App
