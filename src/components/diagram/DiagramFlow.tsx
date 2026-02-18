import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getBlockStyle } from './blockTypes'

// Custom node component for diagram blocks
function DiagramNode({ data }: { data: any }) {
  const style = getBlockStyle(data.type)

  return (
    <div
      style={{
        background: style.bgVar,
        border: `1px solid ${style.borderVar}`,
        borderTop: `3px solid ${style.color}`,
        borderRadius: 'var(--r)',
        padding: '12px 14px',
        minWidth: '280px',
        maxWidth: '350px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Type label */}
      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: style.color,
          marginBottom: '4px',
        }}
      >
        {style.label}
        {data.type === 'DECISION' && ' ✓'}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: '1.35',
          marginBottom: '5px',
        }}
      >
        {data.title}
      </div>

      {/* Body */}
      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          lineHeight: '1.55',
        }}
      >
        {data.body}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  diagramBlock: DiagramNode,
}

interface DiagramFlowProps {
  blocks: any[]
}

export default function DiagramFlow({ blocks }: DiagramFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Convert blocks to React Flow nodes and edges
  useEffect(() => {
    if (blocks.length === 0) return

    // Build adjacency map for level calculation
    const childrenMap = new Map<string, string[]>()
    const parentsMap = new Map<string, string[]>()

    blocks.forEach((block) => {
      childrenMap.set(block.id, [])
      parentsMap.set(block.id, [])
    })

    blocks.forEach((block) => {
      if (block.connects_to) {
        block.connects_to.forEach((targetId: string) => {
          childrenMap.get(block.id)?.push(targetId)
          parentsMap.get(targetId)?.push(block.id)
        })
      }
    })

    // Calculate levels using BFS
    const levels = new Map<string, number>()
    const roots = blocks.filter((b) => (parentsMap.get(b.id)?.length || 0) === 0)
    const queue = roots.map((r) => r.id)
    roots.forEach((r) => levels.set(r.id, 0))

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      const nodeLevel = levels.get(nodeId) || 0
      const children = childrenMap.get(nodeId) || []

      children.forEach((childId) => {
        const currentLevel = levels.get(childId)
        const newLevel = nodeLevel + 1
        if (currentLevel === undefined || newLevel > currentLevel) {
          levels.set(childId, newLevel)
          queue.push(childId)
        }
      })
    }

    // Group by level and position
    const levelGroups = new Map<number, any[]>()
    blocks.forEach((block) => {
      const level = levels.get(block.id) || 0
      if (!levelGroups.has(level)) levelGroups.set(level, [])
      levelGroups.get(level)?.push(block)
    })

    // Create nodes with positions
    const flowNodes: Node[] = []
    const VERTICAL_SPACING = 200
    const HORIZONTAL_SPACING = 400

    levelGroups.forEach((nodesAtLevel, level) => {
      const levelWidth = nodesAtLevel.length * HORIZONTAL_SPACING
      const startX = -levelWidth / 2

      nodesAtLevel.forEach((block: any, index: number) => {
        flowNodes.push({
          id: block.id,
          type: 'diagramBlock',
          position: {
            x: startX + index * HORIZONTAL_SPACING,
            y: level * VERTICAL_SPACING,
          },
          data: {
            type: block.type,
            title: block.title,
            body: block.body,
          },
        })
      })
    })

    // Create edges
    const flowEdges: Edge[] = []
    blocks.forEach((block) => {
      if (block.connects_to && block.connects_to.length > 0) {
        block.connects_to.forEach((targetId: string) => {
          flowEdges.push({
            id: `${block.id}-${targetId}`,
            source: block.id,
            target: targetId,
            type: 'default',
            animated: true,
            style: {
              stroke: 'var(--teal)',
              strokeWidth: 2.5,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: 'var(--teal)',
            },
          })
        })
      }
    })

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [blocks, setNodes, setEdges])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e5e5" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
