import { useRef, useEffect, useState } from 'react'
import DiagramBlock from './DiagramBlock'
import DiagramArrows from './DiagramArrows'

/**
 * 2D graph layout algorithm
 * Positions blocks in a tree/dag structure with branching and convergence
 */
function calculate2DLayout(blocks) {
  if (blocks.length === 0) return []

  // Build adjacency map
  const childrenMap = new Map()
  const parentsMap = new Map()

  blocks.forEach((block) => {
    if (!childrenMap.has(block.id)) childrenMap.set(block.id, [])
    if (!parentsMap.has(block.id)) parentsMap.set(block.id, [])
  })

  blocks.forEach((block) => {
    if (block.connects_to) {
      block.connects_to.forEach((targetId) => {
        childrenMap.get(block.id).push(targetId)
        if (!parentsMap.has(targetId)) parentsMap.set(targetId, [])
        parentsMap.get(targetId).push(block.id)
      })
    }
  })

  // Find root nodes (no parents)
  const roots = blocks.filter((b) => parentsMap.get(b.id).length === 0)

  // Assign levels using BFS
  const levels = new Map()
  const queue = roots.map((r) => r.id)
  roots.forEach((r) => levels.set(r.id, 0))

  while (queue.length > 0) {
    const nodeId = queue.shift()
    const nodeLevel = levels.get(nodeId)
    const children = childrenMap.get(nodeId)

    children.forEach((childId) => {
      const currentLevel = levels.get(childId)
      const newLevel = nodeLevel + 1

      if (currentLevel === undefined || newLevel > currentLevel) {
        levels.set(childId, newLevel)
        queue.push(childId)
      }
    })
  }

  // Group blocks by level
  const levelGroups = new Map()
  blocks.forEach((block) => {
    const level = levels.get(block.id) || 0
    if (!levelGroups.has(level)) levelGroups.set(level, [])
    levelGroups.get(level).push(block)
  })

  // Calculate positions
  const positions = []
  const VERTICAL_SPACING = 180
  const HORIZONTAL_SPACING = 200
  const START_X = 180

  levelGroups.forEach((nodesAtLevel, level) => {
    const levelWidth = nodesAtLevel.length * HORIZONTAL_SPACING
    const startX = START_X - levelWidth / 2

    nodesAtLevel.forEach((node, index) => {
      positions.push({
        id: node.id,
        x: startX + index * HORIZONTAL_SPACING,
        y: level * VERTICAL_SPACING,
      })
    })
  })

  return positions
}

export default function DiagramLayout2D({ blocks, blockRefs }) {
  const containerRef = useRef(null)
  const [positions, setPositions] = useState([])

  // Calculate 2D positions
  useEffect(() => {
    const layout = calculate2DLayout(blocks)
    setPositions(layout)
  }, [blocks])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '600px',
        width: '100%',
        padding: '20px',
      }}
    >
      {/* SVG arrows layer */}
      <DiagramArrows
        blocks={blocks}
        blockRefs={blockRefs}
        containerRef={containerRef.current}
      />

      {/* Positioned blocks */}
      {blocks.map((block, index) => {
        const pos = positions.find((p) => p.id === block.id)
        if (!pos) return null

        return (
          <div
            key={block.id}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: '280px',
            }}
          >
            <DiagramBlock
              ref={(el) => (blockRefs[index] = el)}
              block={block}
              index={index}
            />
          </div>
        )
      })}
    </div>
  )
}
