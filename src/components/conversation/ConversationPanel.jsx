import { useEffect, useRef } from 'react'
import { useMode } from '../../context/ModeProvider'
import MessageKace from './MessageKace'
import MessageUser from './MessageUser'
import RevealCard from './RevealCard'
import TypingIndicator from './TypingIndicator'
import CaptionsBar from './CaptionsBar'

export default function ConversationPanel() {
  const { messages, captionsOpen, isPlaying } = useMode()
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }, 50)
    }
  }, [messages])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-[640px] mx-auto space-y-4">
          {messages.map((msg, index) => {
            if (msg.type === 'kace') {
              return <MessageKace key={index} message={msg.text} />
            } else if (msg.type === 'user') {
              return <MessageUser key={index} message={msg.text} />
            } else if (msg.type === 'case-reveal') {
              return <RevealCard key={index} variant="case" patient={msg.patient} />
            } else if (msg.type === 'vital-reveal') {
              return (
                <RevealCard
                  key={index}
                  variant="vital"
                  vitalKey={msg.vitalKey}
                  vitalData={msg.vitalData}
                />
              )
            }
            return null
          })}

          {/* Typing indicator (demo only) */}
          {isPlaying && <TypingIndicator variant="user" />}
        </div>
      </div>

      {captionsOpen && <CaptionsBar />}
    </div>
  )
}
