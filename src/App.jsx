import { ModeProvider } from './context/ModeProvider'
import TopBar from './components/TopBar'
import Sidebar from './components/sidebar/Sidebar'
import ConversationPanel from './components/conversation/ConversationPanel'
import InputArea from './components/input/InputArea'
import GraphPanel from './components/graph/GraphPanel'
import ExpertOverlay from './components/overlay/ExpertOverlay'

function App() {
  return (
    <ModeProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex flex-col flex-1 min-w-0">
            <ConversationPanel />
            <InputArea />
          </main>
          <GraphPanel />
        </div>
      </div>
      <ExpertOverlay />
    </ModeProvider>
  )
}

export default App
