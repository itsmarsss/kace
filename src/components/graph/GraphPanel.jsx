import { useEffect, useRef } from 'react'
import { useMode } from '../../context/ModeProvider'

export default function GraphPanel() {
  const { graphOpen, graphNodes } = useMode()
  const canvasRef = useRef()

  useEffect(() => {
    if (!graphOpen || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw nodes
    graphNodes.forEach((node) => {
      const x = node.x * rect.width
      const y = node.y * rect.height

      // Glow
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      const colorMap = {
        blue: 'rgba(58, 110, 168, 0.1)',
        amber: 'rgba(192, 122, 26, 0.1)',
        red: 'rgba(201, 64, 64, 0.1)',
        green: 'rgba(45, 155, 111, 0.1)',
      }
      ctx.fillStyle = colorMap[node.color] || 'rgba(0,0,0,0.05)'
      ctx.fill()

      // Dot
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      const dotColorMap = {
        blue: '#3A6EA8',
        amber: '#C07A1A',
        red: '#C94040',
        green: '#2D9B6F',
      }
      ctx.fillStyle = dotColorMap[node.color] || '#8A8780'
      ctx.fill()

      // Label
      ctx.fillStyle = '#6B6760'
      ctx.font = '10.5px Sora, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.label, x, y + 22)
    })
  }, [graphOpen, graphNodes])

  return (
    <aside
      className="flex flex-col overflow-hidden transition-all duration-[380ms]"
      style={{
        width: graphOpen ? '320px' : '0',
        flexShrink: 0,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        transitionTimingFunction: 'var(--ease-out)',
      }}
    >
      <div
        className="px-[18px] py-[14px] pb-[11px] flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="label-caps" style={{ color: 'var(--text-mute)' }}>
          Thought Process
        </div>
        <div
          className="w-[5px] h-[5px] rounded-full animate-pulse"
          style={{ background: 'var(--green)' }}
        />
      </div>

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'transparent' }}
        />
      </div>

      <div className="px-[18px] py-3 text-[10px] space-y-1" style={{ color: 'var(--text-mute)' }}>
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--blue)' }} />
          Vitals
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--amber)' }} />
          Labs
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--red)' }} />
          Cardiac
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--green)' }} />
          Drugs
        </div>
      </div>
    </aside>
  )
}
