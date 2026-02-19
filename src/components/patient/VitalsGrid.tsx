import { useMode } from '../../context/ModeProvider'

export default function VitalsGrid() {
  const { currentCase } = useMode()

  const renderSection = (title: string, vitals: any[]) => (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 pb-[5px] pt-3 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        {title}
        <div className="h-[1px] flex-1 bg-[var(--border)]" />
      </div>

      {/* Vital rows */}
      {vitals.map((vital: any, index: number) => (
        <div key={index} className="flex items-baseline gap-2 px-4 py-[5px]">
          {/* Name */}
          <div className="w-20 flex-shrink-0 font-['DM_Sans',sans-serif] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            {vital.name}
          </div>

          {/* Value */}
          <div className="flex-1 font-['Source_Serif_4',serif] text-[17px] font-medium text-[var(--text-primary)] [font-variation-settings:'opsz'_17]">
            {vital.value}
          </div>

          {/* Unit */}
          <div className="font-['DM_Sans',sans-serif] text-[11px] font-light text-[var(--text-tertiary)]">
            {vital.unit}
          </div>

          {/* Flag dot */}
          {vital.flag && (
            <div
              className={`h-[5px] w-[5px] flex-shrink-0 rounded-full ${
                vital.flag === 'critical'
                  ? 'bg-[var(--crimson)]'
                  : vital.flag === 'caution'
                    ? 'bg-[var(--amber)]'
                    : 'bg-transparent'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderHistory = (historyItems: any[]) => (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 pb-[5px] pt-3 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        HISTORY
        <div className="h-[1px] flex-1 bg-[var(--border)]" />
      </div>

      {/* History entries */}
      {historyItems.map((item: any, index: number) => (
        <div
          key={index}
          className="ml-4 flex flex-col gap-[2px] py-[7px_16px_9px_12px] pl-2"
          style={{
            borderLeft: `2px solid ${item.flag === 'critical' ? 'var(--crimson)' : 'var(--amber)'}`,
          }}
        >
          {/* Label */}
          <div className="font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
            {item.label}
          </div>

          {/* Text with HTML support */}
          <div
            className="font-['DM_Sans',sans-serif] text-[12px] leading-[1.5] text-[var(--text-secondary)]"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto pb-2">
      {renderSection('BASIC VITALS', currentCase.basicVitals)}
      {renderSection('LABS', currentCase.labsVitals)}
      {renderHistory(currentCase.historyVitals)}
    </div>
  )
}
