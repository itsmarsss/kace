export default function SymptomList({ symptoms }) {
  const getIconColor = (icon) => {
    const colorMap = {
      neutral: 'var(--text-mute)',
      amber: 'var(--amber)',
      warning: 'var(--crimson)',
      teal: 'var(--teal)',
      crimson: 'var(--crimson)',
    }
    return colorMap[icon] || 'var(--text-mute)'
  }

  return (
    <div className="px-4 pt-3">
      <div className="label-caps mb-3 flex items-center gap-2">
        Reported Symptoms
        <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
      </div>

      <div className="space-y-[2px]">
        {symptoms.map((symptom, index) => (
          <div
            key={index}
            className="flex items-start gap-[7px] py-[6px] px-4"
            style={{
              borderBottom: '1px solid rgba(0,0,0,0.035)',
            }}
          >
            <div
              className="w-[6px] h-[6px] rounded-full mt-[5px] flex-shrink-0"
              style={{
                background: getIconColor(symptom.icon),
              }}
            />
            <p
              className="text-[11px] leading-[1.4]"
              style={{ color: 'var(--text-dim)' }}
              dangerouslySetInnerHTML={{ __html: symptom.text }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
