import { ModeProvider } from './context/ModeProvider'
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
        <div className="flex flex-1 overflow-hidden">
          <PatientPanel />
          <ReasoningPanel />
          <DiagramPanel />
        </div>
      </div>
      <ExpertOverlay />
    </ModeProvider>
  )
}

export default App
