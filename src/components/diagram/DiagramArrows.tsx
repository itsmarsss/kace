import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function DiagramArrows({ blocks, blockRefs, containerRef }) {
  const [connections, setConnections] = useState([])
  const svgRef = useRef(null)

  // Compute arrow connections from block positions
  useLayoutEffect(() => {
    if (!containerRef || !blocks.length || blockRefs.length !== blocks.length) {
      return
    }

    const containerRect = containerRef.getBoundingClientRect()
    const newConnections = []

    blocks.forEach((block, index) => {
      const fromRef = blockRefs[index]
      if (!fromRef || !block.connects_to || block.connects_to.length === 0) {
        return
      }

      const fromRect = fromRef.getBoundingClientRect()

      block.connects_to.forEach((targetId) => {
        const targetIndex = blocks.findIndex((b) => b.id === targetId)
        if (targetIndex === -1) return

        const toRef = blockRefs[targetIndex]
        if (!toRef) return

        const toRect = toRef.getBoundingClientRect()

        // Calculate positions relative to container
        const fromX = fromRect.left - containerRect.left + fromRect.width / 2
        const fromY = fromRect.bottom - containerRect.top
        const toX = toRect.left - containerRect.left + toRect.width / 2
        const toY = toRect.top - containerRect.top

        newConnections.push({
          id: `${block.id}-${targetId}`,
          fromX,
          fromY,
          toX,
          toY,
          delay: index * 150 + 100, // Delay after source block appears
        })
      })
    })

    setConnections(newConnections)
  }, [blocks, blockRefs, containerRef])

  // Re-compute on window resize
  useEffect(() => {
    const handleResize = () => {
      // Trigger re-layout by updating a dummy state
      setConnections((prev) => [...prev])
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (connections.length === 0) {
    return null
  }

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="rgba(0,0,0,0.22)" />
        </marker>
      </defs>

      {connections.map(({ id, fromX, fromY, toX, toY, delay }) => {
        // Smooth cubic bezier curve
        const midY = (fromY + toY) / 2

        // Path: straight down, curve at middle, then to target
        const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`

        // Approximate path length for dash animation
        const pathLength = Math.abs(toY - fromY) + Math.abs(toX - fromX)

        return (
          <path
            key={id}
            d={d}
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrowhead)"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
            style={{
              animation: `drawLine 0.6s ease forwards`,
              animationDelay: `${delay}ms`,
            }}
          />
        )
      })}
    </svg>
  )
}
