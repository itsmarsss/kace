import { useRef } from 'react'
import { useMode } from '../../context/ModeProvider'
import PatientAvatar from './PatientAvatar'
import SymptomList from './SymptomList'
import VitalButtons from './VitalButtons'

export default function Sidebar() {
  const { sidebarOpen, currentCase, revealedVitals } = useMode()
  const avatarRef = useRef()

  return (
    <aside
      className="flex flex-col overflow-hidden transition-all duration-[380ms]"
      style={{
        width: sidebarOpen ? '240px' : '0',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transitionTimingFunction: 'var(--ease-out)',
      }}
    >
      <PatientAvatar ref={avatarRef} caseId={currentCase.id} />

      <div className="flex-1 overflow-y-auto">
        {/* Chief Complaint */}
        <div className="px-4 pt-5 pb-3">
          <div className="label-caps mb-2">Chief Complaint</div>
          <p className="text-[11px] leading-[1.5]" style={{ color: 'var(--text-dim)' }}>
            {currentCase.patient.chiefComplaint}
          </p>
        </div>

        {/* Reported Symptoms */}
        <SymptomList symptoms={currentCase.patient.initialSymptoms} />

        {/* Known Data */}
        {revealedVitals.length > 0 && (
          <div className="px-4 pt-5">
            <div className="label-caps mb-3 flex items-center gap-2">
              Known Data
              <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
            </div>
            <div className="space-y-2">
              {revealedVitals.map((vitalKey) => {
                const vital = currentCase.vitals[vitalKey]
                if (!vital?.sidebarEntry) return null

                return (
                  <div
                    key={vitalKey}
                    className="flex items-start gap-2 py-[6px] px-3 rounded-[7px] animate-[symIn_0.3s_ease_both]"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      className="w-[6px] h-[6px] rounded-full mt-[5px] flex-shrink-0"
                      style={{
                        background: `var(--${vital.sidebarEntry.icon})`,
                      }}
                    />
                    <p
                      className="text-[11px] leading-[1.4]"
                      style={{ color: 'var(--text-dim)' }}
                      dangerouslySetInnerHTML={{ __html: vital.sidebarEntry.text }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Requestable Info */}
        <div className="px-4 pt-5 pb-5">
          <div className="label-caps mb-3 flex items-center gap-2">
            Request Information
            <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
          </div>
          <VitalButtons />
        </div>
      </div>
    </aside>
  )
}
